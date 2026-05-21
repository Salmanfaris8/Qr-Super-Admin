import { useState, useEffect } from 'react';
import { Check, Crown, Zap, X, Plus, Loader, AlertCircle, Trash2 } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL;
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔐 Attach token from localStorage
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export function Subscriptions() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create');
  const [editingId, setEditingId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [newFeatureName, setNewFeatureName] = useState('');
  const [featureLoading, setFeatureLoading] = useState(false);
  
  // ✅ Feature states
  const [allFeatures, setAllFeatures] = useState([]);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    duration: '',
    features: '',
    limits: ''
  });

  // Fetch plans and features on mount
  useEffect(() => {
    fetchPlans();
    fetchFeatures();
  }, []);

  // ✅ Fetch available features from catalog
  const fetchFeatures = async () => {
    try {
      const res = await api.get('/subscriptions/features');
      setAllFeatures(res.data?.data || []);
    } catch (err) {
      console.error('Error fetching features', err);
    }
  };

  const fetchPlans = async () => {
  try {
    setLoading(true);
    setError(null);

    const response = await api.get('/subscriptions');
    const plansList = Array.isArray(response.data)
      ? response.data
      : response.data.data || [];

    // 🔥 Attach features to each plan
    const updatedPlans = await Promise.all(
      plansList.map(async (plan) => {
        try {
          const res = await api.get(`/subscriptions/features/plan/${plan.id}`);
          const features = res.data?.data?.Features || [];

          return {
            ...plan,
            features: features.map(f => f.name) // ✅ convert to string array
          };
        } catch (err) {
          console.error("Feature fetch failed:", err);
          return { ...plan, features: [] };
        }
      })
    );

    setPlans(updatedPlans);

  } catch (err) {
    console.error(err);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

const handleAddFeature = async () => {
  if (!newFeatureName.trim()) return;

  try {
    setFeatureLoading(true);

    // 🔥 Generate key from name
    const key = newFeatureName
      .toLowerCase()
      .replace(/\s+/g, "_"); // "QR Generation" → "qr_generation"

      console.log({
  name: newFeatureName,
  key: newFeatureName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
});

    const res = await api.post('/subscriptions/features', {
      name: newFeatureName,
      key: key
    });

    const created = res.data?.data;

    setAllFeatures([...allFeatures, created]);
    setNewFeatureName('');

  } catch (err) {
    console.error('Error adding feature:', err);
  } finally {
    setFeatureLoading(false);
  }
};

  // ✅ FETCH PLAN FEATURES for edit mode
  const fetchPlanFeatures = async (planId) => {
    try {
      const res = await api.get(`/subscriptions/features/plan/${planId}`);
      const features = res.data?.data?.Features || [];
      const ids = features.map((f) => f.id);
      setSelectedFeatures(ids);
    } catch (err) {
      console.error('Error fetching plan features:', err);
      setSelectedFeatures([]);
    }
  };

  const openCreateModal = () => {
    setModalMode('create');
    setEditingId(null);
    setFormData({ name: '', price: '', features: '', limits: '' });
    setSelectedFeatures([]); // ✅ Reset features
    setFormError(null);
    setShowModal(true);
  };

  const openEditModal = (plan) => {
    setModalMode('edit');
    setEditingId(plan.id);
    setFormData({
      name: plan.name || '',
      price: (plan.price || '').toString(),
      features: (Array.isArray(plan.features) ? plan.features : []).join('\n'),
      limits: (Array.isArray(plan.limits) ? plan.limits : []).join('\n'),
      duration: plan.duration
    });
    fetchPlanFeatures(plan.id); // ✅ Fetch selected features for this plan
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setFormData({ name: '', price: '', features: '', limits: '' });
    setSelectedFeatures([]); // ✅ Reset features on close
    setFormError(null);
  };

  // ✅ TOGGLE FEATURE CHECKBOX
  const toggleFeature = (id) => {
    setSelectedFeatures((prev) =>
      prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id]
    );
  };

  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Plan name is required');
      return false;
    }
    if (!formData.price || isNaN(formData.price) || parseInt(formData.price) < 0) {
      setFormError('Valid price is required');
      return false;
    }
    if (!formData.duration || isNaN(formData.duration)) {
      setFormError('Duration is required');
      return false;
    }
    if (!formData.features.trim() && selectedFeatures.length === 0) {
      setFormError('At least one feature is required (text or catalog)');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    const newPlan = {
      name: formData.name.trim(),
      price: parseInt(formData.price),
      features: formData.features
        .split('\n')
        .map(f => f.trim())
        .filter(f => f),
      limits: formData.limits
        .split('\n')
        .map(l => l.trim())
        .filter(l => l),
      duration: parseInt(formData.duration)
    };

    try {
      setSubmitting(true);
      setFormError(null);

      if (modalMode === 'create') {
  const response = await api.post('/subscriptions', newPlan);
  const createdPlan = response.data?.data || response.data || newPlan;

  // ✅ Assign features
  if (selectedFeatures.length > 0) {
    await api.post('/subscriptions/features/assign', {
      planId: createdPlan.id,
      featureIds: selectedFeatures
    });
  }

  // 🔥 FETCH FEATURES IMMEDIATELY
  const featureRes = await api.get(`/subscriptions/features/plan/${createdPlan.id}`);
  const features = featureRes.data?.data?.Features || [];

  const finalPlan = {
    ...createdPlan,
    features: features.map(f => f.name)
  };

  // ✅ Update state correctly
  setPlans(prev => [...prev, finalPlan]);

  closeModal();
} else {
const response = await api.put(`/subscriptions/${editingId}`, newPlan);
  const updatedPlan = response.data?.data || response.data || newPlan;

  if (selectedFeatures.length > 0) {
    await api.post('/subscriptions/features/assign', {
      planId: editingId,
      featureIds: selectedFeatures
    });
  }

  // 🔥 FETCH UPDATED FEATURES
  const featureRes = await api.get(`/subscriptions/features/plan/${editingId}`);
  const features = featureRes.data?.data?.Features || [];

  const finalPlan = {
    ...updatedPlan,
    features: features.map(f => f.name)
  };

  setPlans(prev =>
    prev.map(p => p.id === editingId ? finalPlan : p)
  );

  closeModal();
}
    } catch (error) {
      console.error('Error:', error);
      setFormError(error.response?.data?.message || error.message || 'An error occurred. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteFeature = async (id) => {
  if (!window.confirm('Delete this feature?')) return;

  try {
    await api.delete(`/subscriptions/features/${id}`);
    setAllFeatures(allFeatures.filter(f => f.id !== id));
  } catch (err) {
    console.error('Error deleting feature:', err);
  }
};

  const handleDeletePlan = async (planId) => {
    if (!window.confirm('Are you sure you want to delete this plan?')) return;

    try {
      await api.put(`/subscriptions/${planId}/status`);
      setPlans(plans.filter(p => p.id !== planId));
    } catch (error) {
      console.error('Error deleting plan:', error);
      const message = error.response?.data?.message || error.message || 'Failed to delete plan';
      setError(message);
    }
  };

  const getPlanColor = (index, planName) => {
    const colors = [
      { gradient: 'from-gray-500 to-gray-600', bg: 'bg-gray-100', text: 'text-gray-700' },
      { gradient: 'from-[#1E88E5] to-blue-600', bg: 'bg-blue-100', text: 'text-blue-700' },
      { gradient: 'from-purple-500 to-purple-600', bg: 'bg-purple-100', text: 'text-purple-700' }
    ];
    return colors[index % colors.length];
  };

  console.log(plans);
  

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader className="w-8 h-8 animate-spin text-[#1E88E5] mx-auto mb-4" />
          <p className="text-[#6B7280]">Loading subscription plans...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#1A1A1A]">Subscription Plans</h1>
            <p className="text-sm text-[#6B7280] mt-1">Manage pricing tiers and plan features</p>
          </div>
          <Button
            onClick={openCreateModal}
            className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Plan
          </Button>
        </div>

        <Card className="p-6 bg-red-50 border-red-200">
          <div className="flex items-start gap-4">
            <AlertCircle className="w-6 h-6 text-red-500 shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-red-900 mb-2">Error Loading Plans</h3>
              <p className="text-red-700">{error}</p>
              <Button
                onClick={fetchPlans}
                variant="outline"
                className="mt-4 border-red-300 text-red-700 hover:bg-red-100"
              >
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  const totalSubscribers = plans.reduce((sum, p) => sum + (p.subscribers || 0), 0);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Subscription Plans</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage pricing tiers and plan features</p>
        </div>
        <Button
          onClick={openCreateModal}
          className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          New Plan
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Subscribers</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{totalSubscribers}</p>
        </Card>
        {plans.map((plan) => (
          <Card key={plan.id} className="p-4 bg-white border-[#E5E7EB]">
            <p className="text-sm text-[#6B7280]">{plan.name} Plan</p>
            <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{plan.subscribers || 0}</p>
          </Card>
        ))}
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {plans.map((plan, index) => {
          const colors = getPlanColor(index, plan.name);
          const planColor = plan.color || colors.gradient;
          const planBgColor = plan.bgColor || colors.bg;
          const planTextColor = plan.textColor || colors.text;

          return (
            <Card
              key={plan.id}
              className={`bg-white border-[#E5E7EB] overflow-hidden ${
                plan.popular ? 'ring-2 ring-[#1E88E5] shadow-xl' : ''
              }`}
            >
              {plan.popular && (
                <div className="bg-[#1E88E5] text-white text-center py-2 text-sm font-medium">
                  Most Popular
                </div>
              )}
              <div className="p-6 flex flex-col justify-between h-full">
                <div>
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-14 h-14 mx-auto rounded-xl bg-gradient-to-br ${planColor} flex items-center justify-center text-white mb-4`}>
                      {plan.icon || (plan.name === 'Premium' ? <Crown className="w-6 h-6" /> : <Zap className="w-6 h-6" />)}
                    </div>
                    <h3 className="text-2xl font-semibold text-[#1A1A1A]">{plan.name}</h3>
                    <div className="mt-4">
                      <span className="text-4xl font-bold text-[#1A1A1A]">₹{plan.price}</span>
                      <span className="text-[#6B7280]">/month</span>
                    </div>
                    {plan.subscribers !== undefined && (
                      <Badge className={`mt-3 ${planBgColor} ${planTextColor}`}>
                        {plan.subscribers} active subscribers
                      </Badge>
                    )}
                  </div>
                  {/* Features */}
                  {plan.features && plan.features.length > 0 && (
                    <div className="mb-6">
                      {/* Heading */}
                      <p className="text-xs font-semibold text-gray-400 tracking-wide uppercase mb-4">
                        Features Included
                      </p>
                      {/* Feature List */}
                      <div className="space-y-3">
                        {plan.features.map((feature, i) => (
                          <div key={i} className="flex items-start gap-3">
                            {/* Green Tick */}
                            <Check className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            {/* Text */}
                            <span className="text-sm text-gray-800 leading-relaxed">
                              {feature}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Limits */}
                {/* {plan.limits && plan.limits.length > 0 && (
                  <div className="space-y-3 mb-6 pt-6 border-t border-[#E5E7EB]">
                    <p className="text-sm font-medium text-[#6B7280] uppercase">Limitations</p>
                    {plan.limits.map((limit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">
                          <div className="w-1 h-3 bg-[#6B7280] rounded" />
                        </div>
                        <span className="text-sm text-[#6B7280]">{limit}</span>
                      </div>
                    ))}
                  </div>
                )} */}

                {/* Actions */}
                <div className="space-y-2 pt-6 border-t border-[#E5E7EB]">
                  <Button
                    onClick={() => openEditModal(plan)}
                    className={`w-full ${
                      plan.popular
                        ? 'bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white'
                        : 'bg-gray-900 hover:bg-gray-800 text-white'
                    }`}
                  >
                    Edit Plan Details
                  </Button>
                  <Button variant="outline" className="w-full border-[#E5E7EB]">
                    View Subscribers
                  </Button>
                  <Button
                    onClick={() => handleDeletePlan(plan.id)}
                    variant="outline"
                    className="w-full border-red-200 text-red-600 hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Delete Plan
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* No Plans Message */}
      {plans.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <Zap className="w-12 h-12 text-[#6B7280] mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">No Plans Yet</h3>
          <p className="text-[#6B7280] mb-6">Create your first subscription plan to get started</p>
          <Button
            onClick={openCreateModal}
            className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white"
          >
            Create First Plan
          </Button>
        </Card>
      )}

      {/* Plan Management */}
      {/* <Card className="p-6 bg-white border-[#E5E7EB]">
        <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">Plan Management</h3>
        <div className="space-y-3">
          <Button onClick={openCreateModal} variant="outline" className="w-full sm:w-auto border-[#E5E7EB]">
            Create New Plan
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-[#E5E7EB] ml-0 sm:ml-3">
            Edit Pricing
          </Button>
          <Button variant="outline" className="w-full sm:w-auto border-[#E5E7EB] ml-0 sm:ml-3">
            Manage Features
          </Button>
        </div>
      </Card> */}

      <Card className="p-6 bg-white border-[#E5E7EB]">
  <h3 className="text-lg font-semibold text-[#1A1A1A] mb-4">
    Feature Management
  </h3>

  {/* Add Feature */}
  <div className="flex gap-3 mb-6">
    <input
      type="text"
      value={newFeatureName}
      onChange={(e) => setNewFeatureName(e.target.value)}
      placeholder="Enter new feature (e.g., QR Generation)"
      className="flex-1 px-3 py-2 border border-[#E5E7EB] rounded-lg focus:ring-2 focus:ring-[#1E88E5]"
    />

    <Button
      onClick={handleAddFeature}
      className="bg-[#1E88E5] text-white"
      disabled={featureLoading}
    >
      {featureLoading ? <Loader className="w-4 h-4 animate-spin" /> : "Add"}
    </Button>
  </div>

  {/* Feature List */}
  <div className="space-y-2">
    {allFeatures.map((feature) => (
      <div
        key={feature.id}
        className="flex items-center justify-between p-3 border border-[#E5E7EB] rounded-lg"
      >
        <span className="text-sm text-[#1A1A1A]">
          {feature.name}
        </span>

        <button
          onClick={() => handleDeleteFeature(feature.id)}
          className="text-red-500 hover:text-red-700"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    ))}
  </div>
</Card>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md bg-white border-[#E5E7EB] relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="sticky top-4 right-4 float-right p-1 hover:bg-gray-100 rounded-lg transition"
            >
              <X className="w-5 h-5 text-[#6B7280]" />
            </button>

            <div className="p-6">
              <h2 className="text-xl font-semibold text-[#1A1A1A] mb-2">
                {modalMode === 'create' ? 'Create New Plan' : 'Edit Plan'}
              </h2>
              {formError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-sm text-red-700">{formError}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Plan Name */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Plan Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g., Basic, Standard, Premium"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                    required
                  />
                </div>

                {/* Price */}
                <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Monthly Price ($) *
                  </label>
                  <input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    placeholder="e.g., 99"
                    min="0"
                    step="0.01"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                    required
                  />
                </div>

                {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Duration (days) *
                    </label>
                    <input
                      type="number"
                      value={formData.duration}
                      onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                      placeholder="e.g., 30"
                      min="1"
                      className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5]"
                      required
                    />
                  </div>

                {/* Features (Text) */}
                {/* <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Custom Features (one per line)
                  </label>
                  <textarea
                    value={formData.features}
                    onChange={(e) => setFormData({ ...formData, features: e.target.value })}
                    placeholder="Enter features separated by line breaks"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                    rows={3}
                  />
                </div> */}

                {/* Features from Catalog (Checkboxes) */}
                {allFeatures && allFeatures.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                      Select Features from Catalog
                    </label>
                    <div className="space-y-2 max-h-48 overflow-y-auto border border-[#E5E7EB] rounded-lg p-3 bg-gray-50">
                      {allFeatures.map((feature) => (
                        <label key={feature.id} className="flex items-center gap-2 cursor-pointer hover:bg-white p-1 rounded">
                          <input
                            type="checkbox"
                            checked={selectedFeatures.includes(feature.id)}
                            onChange={() => toggleFeature(feature.id)}
                            className="w-4 h-4 rounded border-[#E5E7EB] cursor-pointer"
                          />
                          <span className="text-sm text-[#1A1A1A]">{feature.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Limits */}
                {/* <div>
                  <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                    Limitations (one per line)
                  </label>
                  <textarea
                    value={formData.limits}
                    onChange={(e) => setFormData({ ...formData, limits: e.target.value })}
                    placeholder="Enter limitations separated by line breaks (optional)"
                    className="w-full px-3 py-2 border border-[#E5E7EB] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1E88E5] focus:border-transparent"
                    rows={3}
                  />
                </div> */}

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={closeModal}
                    variant="outline"
                    className="flex-1 border-[#E5E7EB]"
                    disabled={submitting}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white"
                    disabled={submitting}
                  >
                    {submitting ? (
                      <>
                        <Loader className="w-4 h-4 mr-2 animate-spin" />
                        {modalMode === 'create' ? 'Creating...' : 'Saving...'}
                      </>
                    ) : (
                      modalMode === 'create' ? 'Create Plan' : 'Save Changes'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}