import { useState } from 'react';
import { CheckCircle, XCircle, Eye, FileText } from 'lucide-react';
import { Card } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { pendingRestaurants } from '../data/mockData';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog';

export function Approvals() {
  const [selectedRestaurant, setSelectedRestaurant] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-[#1A1A1A]">Restaurant Approvals</h1>
        <p className="text-sm text-[#6B7280] mt-1">
          Review and approve new restaurant registration requests
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Pending Approvals</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">{pendingRestaurants.length}</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 text-xl font-bold">{pendingRestaurants.length}</span>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Approved Today</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">5</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-green-100 flex items-center justify-center">
              <span className="text-green-600 text-xl font-bold">5</span>
            </div>
          </div>
        </Card>
        <Card className="p-4 bg-white border-[#E5E7EB]">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-[#6B7280]">Rejected Today</p>
              <p className="text-2xl font-semibold text-[#1A1A1A] mt-1">1</p>
            </div>
            <div className="w-12 h-12 rounded-lg bg-red-100 flex items-center justify-center">
              <span className="text-red-600 text-xl font-bold">1</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Pending Requests */}
      <div className="space-y-4">
        {pendingRestaurants.map((restaurant) => (
          <Card key={restaurant.id} className="p-6 bg-white border-[#E5E7EB] hover:shadow-lg transition-shadow">
            <div className="flex flex-col lg:flex-row gap-6">
              {/* Restaurant Info */}
              <div className="flex-1 space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-[#1A1A1A]">{restaurant.name}</h3>
                    <p className="text-sm text-[#6B7280] mt-1">ID: {restaurant.id}</p>
                  </div>
                  <Badge className="bg-yellow-100 text-yellow-700">Pending Review</Badge>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-[#6B7280]">Owner Name</p>
                    <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.ownerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Email</p>
                    <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Phone</p>
                    <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Location</p>
                    <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Requested Plan</p>
                    <Badge
                      className={`
                        mt-1
                        ${restaurant.requestedPlan === 'Premium' ? 'bg-purple-100 text-purple-700' : ''}
                        ${restaurant.requestedPlan === 'Standard' ? 'bg-blue-100 text-blue-700' : ''}
                        ${restaurant.requestedPlan === 'Basic' ? 'bg-gray-100 text-gray-700' : ''}
                      `}
                    >
                      {restaurant.requestedPlan}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm text-[#6B7280]">Submitted Date</p>
                    <p className="font-medium text-[#1A1A1A] mt-1">
                      {new Date(restaurant.submittedDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Business License */}
                <div className="pt-4 border-t border-[#E5E7EB]">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#6B7280]" />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#1A1A1A]">Business License</p>
                      <p className="text-sm text-[#6B7280]">{restaurant.businessLicense}</p>
                    </div>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="border-[#E5E7EB]">
                          <Eye className="w-4 h-4 mr-2" />
                          View Document
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Business License - {restaurant.name}</DialogTitle>
                          <DialogDescription>
                            License Number: {restaurant.businessLicense}
                          </DialogDescription>
                        </DialogHeader>
                        <div className="mt-4 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300 text-center">
                          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                          <p className="text-sm text-gray-600">
                            Business license document preview would appear here
                          </p>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex lg:flex-col gap-3 lg:w-48">
                <Button className="flex-1 lg:flex-none bg-[#00C853] hover:bg-[#00C853]/90 text-white">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Approve
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 lg:flex-none border-red-200 text-red-600 hover:bg-red-50"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Reject
                </Button>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="flex-1 lg:flex-none border-[#E5E7EB]">
                      <Eye className="w-4 h-4 mr-2" />
                      Details
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <DialogHeader>
                      <DialogTitle>{restaurant.name} - Full Details</DialogTitle>
                      <DialogDescription>Complete registration information</DialogDescription>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-[#6B7280]">Restaurant Name</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.name}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Owner Name</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.ownerName}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Email Address</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.email}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Phone Number</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.phone}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Location</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.location}</p>
                        </div>
                        <div>
                          <p className="text-sm text-[#6B7280]">Requested Plan</p>
                          <p className="font-medium text-[#1A1A1A] mt-1">{restaurant.requestedPlan}</p>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {/* No Pending Requests */}
      {pendingRestaurants.length === 0 && (
        <Card className="p-12 bg-white border-[#E5E7EB] text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-[#1A1A1A] mb-2">All Caught Up!</h3>
          <p className="text-[#6B7280]">There are no pending restaurant approvals at this time.</p>
        </Card>
      )}
    </div>
  );
}
