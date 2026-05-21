import { useState, useEffect } from "react";
import axios from "axios";
import { Plus, Star, Download, Eye, Edit, Trash2, Search, X } from "lucide-react";
import { Card } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Badge } from "../components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../components/ui/select";
import { TemplateEditor } from "./Templateeditor";
import { TemplateConfig } from "./Templateconfig";
import {
  ensureConfigForCatalog,
  getTemplateComponentByCatalogId,
  inferCatalogThemeId,
  resolveMenuThemeConfig,
  type ThemeRecord,
} from "../utils/templateResolver";

const API_BASE_URL = import.meta.env.VITE_API_URL;
const TEMPLATE_STORAGE_KEY = "superAdminTemplateConfigs";

type MenuTheme = ThemeRecord & {
  id: string;
  name: string;
  tier: string;
  rating?: number;
  downloads?: number;
  previewImage?: string;
};

export function MenuThemes() {
  const [themes, setThemes] = useState<MenuTheme[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterTier, setFilterTier] = useState("all");
  const [open, setOpen] = useState(false);
  const [jsonFile, setJsonFile] = useState<File | null>(null);
  const [plans, setPlans] = useState<any[]>([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [saveThemeData, setSaveThemeData] = useState({
    name: "",
    previewImage: "",
    tier: "",
    config: null as TemplateConfig | null,
  });
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorConfig, setEditorConfig] = useState<TemplateConfig | null>(null);
  const [editingThemeId, setEditingThemeId] = useState<string | null>(null);
  const [savedConfigs, setSavedConfigs] = useState<Record<string, TemplateConfig>>({});
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [previewThemeId, setPreviewThemeId] = useState<string | null>(null);
  const [showMetaModal, setShowMetaModal] = useState(false);
  const [editingMetaThemeId, setEditingMetaThemeId] = useState<string | null>(null);
  const [metaImageFile, setMetaImageFile] = useState<File | null>(null);
  const [metaForm, setMetaForm] = useState({ name: "", previewImage: "", tier: "" });

  const token = localStorage.getItem("token");
  const authHeaders = { Authorization: `Bearer ${token}` };

  const fetchThemes = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${API_BASE_URL}/super-admin/menu-themes`, {
        headers: authHeaders,
      });
      const list = (res.data?.data || []) as MenuTheme[];
      setThemes(list);
      if (!selectedThemeId && list.length > 0) setSelectedThemeId(list[0].id);
    } catch (err) {
      console.log("Error fetching themes:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPlans = async () => {
    try {
      const res = await axios.get(`${API_BASE_URL}/public/plans`);
      setPlans(res.data.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchThemes();
    fetchPlans();
  }, []);

  useEffect(() => {
    const data = localStorage.getItem(TEMPLATE_STORAGE_KEY);
    if (!data) return;
    try {
      setSavedConfigs(JSON.parse(data));
    } catch {
      /* ignore */
    }
  }, []);

  const getConfigForTheme = (themeId: string): TemplateConfig | undefined => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return undefined;
    return resolveMenuThemeConfig(theme, themes, savedConfigs[themeId]);
  };

  const handlePreviewUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setSaveThemeData((prev) => ({ ...prev, previewImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleMetaImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setMetaImageFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setMetaForm((prev) => ({ ...prev, previewImage: reader.result as string }));
    };
    reader.readAsDataURL(file);
  };

  const handleOpenMetaEditor = (themeId: string) => {
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;
    setEditingMetaThemeId(themeId);
    setMetaImageFile(null);
    setMetaForm({
      name: theme.name || "",
      previewImage: theme.previewImage || "",
      tier: theme.tier || "",
    });
    setShowMetaModal(true);
  };

  const handleSaveMeta = async () => {
    if (!editingMetaThemeId) return;
    try {
      const res = await axios.put(
        `${API_BASE_URL}/menu-theme/${editingMetaThemeId}`,
        {
          name: metaForm.name,
          previewImage: metaForm.previewImage,
          tier: metaForm.tier,
        },
        { headers: authHeaders }
      );
      const updated = res.data?.data;
      if (updated) {
        setThemes((prev) => prev.map((t) => (t.id === editingMetaThemeId ? { ...t, ...updated } : t)));
      } else {
        await fetchThemes();
      }
      setShowMetaModal(false);
      setEditingMetaThemeId(null);
    } catch (err) {
      console.log("Update theme details failed:", err);
    }
  };

  const handleEditTemplate = (themeId: string) => {
    const config = getConfigForTheme(themeId);
    if (!config) return;
    setEditingThemeId(themeId);
    setSelectedThemeId(themeId);
    setEditorConfig(JSON.parse(JSON.stringify(config)));
    setShowEditor(true);
  };

  const handlePreview = (themeId: string) => {
    setPreviewThemeId(themeId);
    setSelectedThemeId(themeId);
    setShowPreviewModal(true);
  };

  const handleOpenSaveTheme = async () => {
    const themeId = editingThemeId || selectedThemeId;
    if (!themeId) return;
    const theme = themes.find((t) => t.id === themeId);
    const config = getConfigForTheme(themeId);
    if (!theme || !config) return;
    await fetchPlans();
    setSaveThemeData({
      name: `${theme.name} Copy`,
      previewImage: "",
      tier: "",
      config,
    });
    setShowSaveModal(true);
  };

  const handleSave = async (config: TemplateConfig) => {
    const themeId = editingThemeId;
    if (!themeId) return;
    const theme = themes.find((t) => t.id === themeId);
    if (!theme) return;
    const catalogId = inferCatalogThemeId(theme, themes);
    const configToSave = ensureConfigForCatalog(catalogId, config);
    setSavedConfigs((prev) => {
      const updated = { ...prev, [themeId]: configToSave };
      localStorage.setItem(TEMPLATE_STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
    try {
      await axios.put(
        `${API_BASE_URL}/menu-theme/${themeId}`,
        { config: configToSave },
        { headers: authHeaders }
      );
      setThemes((prev) => prev.map((t) => (t.id === themeId ? { ...t, config: configToSave } : t)));
    } catch (err) {
      console.log("Save theme config failed (saved locally):", err);
    }
    setShowEditor(false);
    setEditingThemeId(null);
    setEditorConfig(null);
  };

  const handleSaveTheme = async () => {
    if (!saveThemeData.name || !saveThemeData.config || !saveThemeData.tier) return;
    try {
      await axios.post(
        `${API_BASE_URL}/menu-theme/add`,
        {
          name: saveThemeData.name,
          previewImage: saveThemeData.previewImage,
          config: saveThemeData.config,
          tier: saveThemeData.tier,
        },
        { headers: authHeaders }
      );
      setShowSaveModal(false);
      setSaveThemeData({ name: "", previewImage: "", tier: "", config: null });
      await fetchThemes();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await axios.delete(`${API_BASE_URL}/super-admin/menu-themes/${id}`, { headers: authHeaders });
      setThemes((prev) => prev.filter((t) => t.id !== id));
      if (selectedThemeId === id) setSelectedThemeId(null);
    } catch (err) {
      console.log("Delete failed:", err);
    }
  };

  const filteredThemes = themes.filter((theme) => {
    const matchesSearch = theme.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTier = filterTier === "all" || String(theme.tier || "").toLowerCase() === String(filterTier).toLowerCase();
    return matchesSearch && matchesTier;
  });

  const selectedThemeRecord = selectedThemeId ? themes.find((t) => t.id === selectedThemeId) : undefined;
  const previewThemeRecord = previewThemeId ? themes.find((t) => t.id === previewThemeId) : undefined;
  const liveCatalog = selectedThemeRecord ? inferCatalogThemeId(selectedThemeRecord, themes) : null;
  const previewCatalog = previewThemeRecord ? inferCatalogThemeId(previewThemeRecord, themes) : null;
  const livePreviewConfig = selectedThemeId ? getConfigForTheme(selectedThemeId) : undefined;
  const previewConfig = previewThemeId ? getConfigForTheme(previewThemeId) : undefined;
  const LiveTemplate = liveCatalog ? getTemplateComponentByCatalogId(liveCatalog) : null;
  const PreviewTemplate = previewCatalog ? getTemplateComponentByCatalogId(previewCatalog) : null;  

  return (
    <div className="space-y-6">

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-[#1A1A1A]">Menu Themes</h1>
          <p className="text-sm text-[#6B7280] mt-1">Manage menu templates for restaurants</p>
        </div>
        <Button
          className="bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add New Theme
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Themes</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{themes.length}</p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Total Downloads</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {themes.reduce((sum, t) => sum + (t.downloads || 0), 0)}
          </p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Avg. Rating</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {themes.length
              ? (themes.reduce((sum, t) => sum + (t.rating || 0), 0) / themes.length).toFixed(1)
              : 0}
          </p>
        </Card>

        <Card className="p-4 bg-white border-[#E5E7EB]">
          <p className="text-sm text-[#6B7280]">Categories</p>
          <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">
            {plans?.length}
          </p>
        </Card>
      </div>

      {/* Filters */}
      <Card className="p-4 bg-white border-[#E5E7EB]">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#6B7280]" />
            <Input
              type="search"
              placeholder="Search themes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={filterTier} onValueChange={setFilterTier}>
            <SelectTrigger className="w-full sm:w-[200px]">
              <SelectValue placeholder="Filter by tier" />
            </SelectTrigger>

            <SelectContent>

              <SelectItem value="all">
                All Tiers
              </SelectItem>

              {plans.map((plan) => (
                <SelectItem key={plan.id} value={plan.name}>
                  {plan.name}
                </SelectItem>
              ))}

            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Themes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredThemes.map((theme) => (
          <Card
            key={theme.id}
            className={`bg-white border-[#E5E7EB] overflow-hidden hover:shadow-lg transition-shadow cursor-pointer ${
              selectedThemeId === theme.id ? 'ring-2 ring-[#1E88E5]' : ''
            }`}
            onClick={() => setSelectedThemeId(theme.id)}
          >
            {/* Preview */}
            <div className="aspect-[4/3] bg-gradient-to-br from-gray-100 to-gray-200 relative group h-50">
              {theme.previewImage ? (
                <img src={theme.previewImage} alt={theme.name} className="w-full h-full object-cover" />
              ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-white rounded-lg shadow-lg mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🍽️</span>
                    </div>
                    <p className="text-sm font-medium text-gray-600">{theme.name}</p>
                  </div>
                </div>
              )}

              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(theme.id);
                  }}
                >
                  <Eye className="w-4 h-4 mr-2" />
                  Preview
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="font-semibold text-[#1A1A1A]">{theme.name}</h3>
              <Badge className="mt-1 bg-gray-100 text-gray-700 text-xs">
                {theme?.tier}
              </Badge>

              <div className="flex items-center gap-4 mt-3 text-sm">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  <span>{theme.rating}</span>
                </div>
                <div className="flex items-center gap-1 text-[#6B7280]">
                  <Download className="w-4 h-4" />
                  <span>{theme.downloads}</span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-2 mt-4 pt-4 border-t border-[#E5E7EB]">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex-1 border-[#E5E7EB]"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview(theme.id);
                  }}
                >
                  <Eye className="w-3 h-3 mr-1" />
                  View
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTemplate(theme.id);
                  }}
                >
                  <Edit className="w-3 h-3" />
                </Button>

                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(theme.id);
                  }}
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>

              <div
                className={`grid ${
                  theme.id ? "grid-cols-1" : "grid-cols-2"
                } gap-2 mt-3`}
              >
                {/* Show only if theme is NOT already in backend */}
                {!theme.id && (
                  <Button
                    className="w-full bg-[#1E88E5] hover:bg-[#1E88E5]/90 text-white hover:text-white"
                    variant="outline"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedThemeId(theme.id);
                      handleOpenSaveTheme();
                    }}
                  >
                    Save As New
                  </Button>
                )}

                <Button
                  className="w-full"
                  variant="outline"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenMetaEditor(theme.id);
                  }}
                >
                  Edit Details
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filteredThemes.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <p className="text-[#6B7280]">No themes found matching your search.</p>
        </Card>
      )}

      {selectedThemeId && LiveTemplate && livePreviewConfig && (
        <Card className="p-6 bg-white border-[#E5E7EB]">
          <h2 className="text-xl font-semibold text-[#1A1A1A] mb-4">Live Menu Preview</h2>
          <div className="bg-gray-100 rounded-lg p-4 sm:p-8 flex items-center justify-center overflow-auto">
            <div className="w-full">
              <LiveTemplate key={liveCatalog ?? selectedThemeId} config={livePreviewConfig} />
            </div>
          </div>
        </Card>
      )}

      {showPreviewModal && previewThemeId && PreviewTemplate && previewConfig && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative w-full max-w-4xl max-h-[90vh] overflow-auto bg-white rounded-2xl shadow-xl">
            <Button
              variant="outline"
              size="sm"
              className="absolute top-4 right-4 z-10 bg-white"
              onClick={() => {
                setShowPreviewModal(false);
                setPreviewThemeId(null);
              }}
            >
              <X className="w-4 h-4" />
            </Button>
            <div className="p-6 pt-14">
              <PreviewTemplate key={previewCatalog ?? previewThemeId} config={previewConfig} />
            </div>
          </div>
        </div>
      )}

      {showEditor && editorConfig && (
        <TemplateEditor
          config={editorConfig}
          renderPreview={(liveConfig: TemplateConfig) => {
            const activeThemeId = editingThemeId ?? selectedThemeId;
            if (!activeThemeId) return null;
            const theme = themes.find((t) => t.id === activeThemeId) as ThemeRecord | undefined;
            if (!theme) return null;
            const catalogId = inferCatalogThemeId(theme, themes);
            const Template = getTemplateComponentByCatalogId(catalogId);
            return (
              <Template
                key={catalogId}
                config={ensureConfigForCatalog(catalogId, liveConfig)}
              />
            );
          }}
          onSave={handleSave}
          onClose={() => {
            setShowEditor(false);
            setEditingThemeId(null);
            setEditorConfig(null);
          }}
        />
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-lg">
          <div className="w-[560px] bg-white/90 backdrop-blur-xl rounded-3xl shadow-[0_25px_80px_rgba(0,0,0,0.35)] border border-white/20 overflow-hidden transition-all">
            <div className="relative px-8 py-7 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top,white,transparent_60%)]" />
              <h2 className="text-white text-2xl font-semibold tracking-tight text-center">
                Upload Theme
              </h2>
              <p className="text-blue-100 text-sm mt-1 text-center">
                Import a menu design via JSON file
              </p>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  JSON File
                </label>

                <label className="mt-3 flex flex-col items-center justify-center gap-3 border border-dashed border-gray-300 rounded-2xl p-8 cursor-pointer hover:border-blue-500 hover:bg-blue-50/40 transition-all group">
                  <input
                    type="file"
                    accept=".json"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) setJsonFile(file);
                    }}
                  />
                  <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-xl group-hover:scale-110 transition">
                    📄
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-gray-700">
                      Click to upload or drag JSON
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      Only .json files supported
                    </p>
                  </div>
                  {jsonFile && (
                    <p className="text-xs text-blue-600 font-medium mt-2">
                      {jsonFile.name}
                    </p>
                  )}
                </label>
              </div>
            </div>

            <div className="px-8 py-5 flex justify-between items-center bg-white/70 backdrop-blur border-t">
              <p className="text-xs text-gray-400">
                JSON will be validated before saving
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 text-sm rounded-xl border border-gray-200 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>

                <button
                  onClick={async () => {
                    if (!jsonFile) {
                      alert("Please select a JSON file");
                      return;
                    }
                    try {
                      const formData = new FormData();
                      formData.append("file", jsonFile);

                      await axios.post(
                        `${API_BASE_URL}/super-admin/menu-themes/seed`,
                        formData,
                        {
                          headers: {
                            Authorization: `Bearer ${token}`,
                          }
                        }
                      );

                      await fetchThemes();
                      setJsonFile(null);
                      setOpen(false);
                    } catch (err) {
                      console.log("Seed themes error:", err);
                    }
                  }}
                  className="px-5 py-2 text-sm rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-xl hover:scale-[1.03] transition"
                >
                  Upload
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-[600px] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Save Theme</h2>
              <p className="text-sm text-gray-500">Create a reusable theme template</p>
            </div>

            <div className="p-6 space-y-5 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
              <Input
                placeholder="Theme Name"
                value={saveThemeData.name}
                onChange={(e) =>
                  setSaveThemeData(prev => ({ ...prev, name: e.target.value }))
                }
              />

              <Select
                value={saveThemeData.tier}
                onValueChange={(v) =>
                  setSaveThemeData(prev => ({ ...prev, tier: v }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview Image
                </label>

                <label className="mt-3 relative flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl h-52 overflow-hidden cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePreviewUpload}
                  />

                  {saveThemeData.previewImage ? (
                    <>
                      <img
                        src={saveThemeData.previewImage}
                        alt="Preview"
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center">
                        <div className="text-3xl mb-2">🖼️</div>
                        <p className="text-white text-sm font-medium">Change Image</p>
                        {previewFile && (
                          <p className="text-xs text-gray-200 mt-1">{previewFile.name}</p>
                        )}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition">
                        🖼️
                      </div>
                      <p className="mt-3 text-sm font-medium text-gray-700">Upload Preview Image</p>
                      <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP supported</p>
                    </>
                  )}
                </label>
              </div>

              <div>
                <p className="text-sm mb-2">JSON Preview</p>
                <pre className="bg-gray-100 p-3 rounded text-xs max-h-48 overflow-auto">
                  {JSON.stringify(saveThemeData.config, null, 2)}
                </pre>
              </div>
            </div>

            <div className="p-5 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowSaveModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveTheme}>
                Save Theme
              </Button>
            </div>
          </div>
        </div>
      )}

      {showMetaModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-3xl w-[560px] max-h-[90vh] shadow-2xl overflow-hidden flex flex-col">
            <div className="p-6 border-b">
              <h2 className="text-xl font-semibold">Edit Theme Details</h2>
              <p className="text-sm text-gray-500">Update name, preview image and plan tier</p>
            </div>
            <div className="p-6 space-y-5 overflow-y-auto">
              <Input
                placeholder="Theme Name"
                value={metaForm.name}
                onChange={(e) => setMetaForm((prev) => ({ ...prev, name: e.target.value }))}
              />
              <Select
                value={metaForm.tier}
                onValueChange={(v) => setMetaForm((prev) => ({ ...prev, tier: v }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select Plan" />
                </SelectTrigger>
                <SelectContent>
                  {plans.map((plan) => (
                    <SelectItem key={plan.id} value={plan.name.toLowerCase()}>
                      {plan.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <div>
                <label className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preview Image
                </label>
                <label className="mt-3 relative flex flex-col items-center justify-center border border-dashed border-gray-300 rounded-2xl h-48 overflow-hidden cursor-pointer hover:border-blue-500 hover:bg-blue-50/30 transition-all group">
                  <input type="file" accept="image/*" className="hidden" onChange={handleMetaImageUpload} />
                  {metaForm.previewImage ? (
                    <>
                      <img src={metaForm.previewImage} alt="Preview" className="absolute inset-0 w-full h-full object-contain" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex flex-col items-center justify-center">
                        <div className="text-3xl mb-2">🖼️</div>
                        <p className="text-white text-sm font-medium">Change Image</p>
                        {metaImageFile && <p className="text-xs text-gray-200 mt-1">{metaImageFile.name}</p>}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 rounded-full bg-blue-50 flex items-center justify-center text-2xl group-hover:scale-110 transition">🖼️</div>
                      <p className="mt-3 text-sm font-medium text-gray-700">Upload Preview Image</p>
                    </>
                  )}
                </label>
              </div>
            </div>
            <div className="p-5 border-t flex justify-end gap-3">
              <Button variant="outline" onClick={() => setShowMetaModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSaveMeta}>Update Theme</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}