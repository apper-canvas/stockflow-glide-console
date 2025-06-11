import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ApperIcon from '@/components/ApperIcon';
import Button from '@/components/atoms/Button';
import PropTypes from 'prop-types';

const SupplierCard = ({ supplier, onEdit, onDelete, onUpdateRating }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [ratings, setRatings] = useState({
    delivery: supplier.rating.delivery,
    quality: supplier.rating.quality,
    pricing: supplier.rating.pricing,
    communication: supplier.rating.communication
  });

  const formatAddress = (address) => {
    return `${address.city}, ${address.state}, ${address.country}`;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getRatingColor = (rating) => {
    if (rating >= 4.5) return 'text-green-600';
    if (rating >= 3.5) return 'text-yellow-600';
    if (rating >= 2.5) return 'text-orange-600';
    return 'text-red-600';
  };

  const handleRatingSubmit = () => {
    onUpdateRating(supplier.id, ratings);
    setShowRatingModal(false);
  };

  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

    for (let i = 0; i < 5; i++) {
      if (i < fullStars) {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            size={16}
            className="text-yellow-400 fill-current"
          />
        );
      } else if (i === fullStars && hasHalfStar) {
        stars.push(
          <div key={i} className="relative">
            <ApperIcon name="Star" size={16} className="text-gray-300" />
            <div className="absolute inset-0 overflow-hidden w-1/2">
              <ApperIcon name="Star" size={16} className="text-yellow-400 fill-current" />
            </div>
          </div>
        );
      } else {
        stars.push(
          <ApperIcon
            key={i}
            name="Star"
            size={16}
            className="text-gray-300"
          />
        );
      }
    }

    return stars;
  };

  const renderRatingInput = (label, value, onChange) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="focus:outline-none"
          >
            <ApperIcon
              name="Star"
              size={20}
              className={`${
                star <= value
                  ? 'text-yellow-400 fill-current'
                  : 'text-gray-300'
              } hover:text-yellow-400 transition-colors`}
            />
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-500">{value}/5</div>
    </div>
  );

  return (
    <>
      <motion.div
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        whileHover={{ y: -2 }}
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900 mb-1">
              {supplier.name}
            </h3>
            <p className="text-sm text-gray-600">{supplier.companyType}</p>
          </div>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              supplier.status
            )}`}
          >
            {supplier.status}
          </span>
        </div>

        {/* Rating */}
        <div className="flex items-center mb-4">
          <div className="flex items-center mr-2">
            {renderStars(supplier.rating.overall)}
          </div>
          <span className={`text-sm font-medium ${getRatingColor(supplier.rating.overall)}`}>
            {supplier.rating.overall.toFixed(1)}
          </span>
          <button
            onClick={() => setShowRatingModal(true)}
            className="ml-2 text-xs text-blue-600 hover:text-blue-800"
          >
            Rate
          </button>
        </div>

        {/* Contact Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Mail" size={14} className="mr-2" />
            {supplier.email}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="Phone" size={14} className="mr-2" />
            {supplier.phone}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <ApperIcon name="MapPin" size={14} className="mr-2" />
            {formatAddress(supplier.address)}
          </div>
        </div>

        {/* Categories */}
        <div className="mb-4">
          <div className="flex flex-wrap gap-1">
            {supplier.categories.slice(0, 3).map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full"
              >
                {category}
              </span>
            ))}
            {supplier.categories.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-full">
                +{supplier.categories.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
          <div>
            <div className="text-gray-500">Delivery Rate</div>
            <div className="font-medium">{supplier.kpis.onTimeDeliveryRate}%</div>
          </div>
          <div>
            <div className="text-gray-500">Lead Time</div>
            <div className="font-medium">{supplier.leadTime} days</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDetails(!showDetails)}
            className="flex-1"
          >
            <ApperIcon name={showDetails ? "ChevronUp" : "ChevronDown"} size={16} />
            {showDetails ? 'Less' : 'Details'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(supplier)}
          >
            <ApperIcon name="Edit" size={16} />
          </Button>
          {supplier.status === 'active' && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete(supplier.id)}
              className="text-red-600 hover:text-red-700"
            >
              <ApperIcon name="Trash2" size={16} />
            </Button>
          )}
        </div>

        {/* Expanded Details */}
        {showDetails && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4 pt-4 border-t border-gray-200 space-y-3"
          >
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Primary Contact</h4>
              <div className="text-sm text-gray-600">
                <div>{supplier.primaryContact.name} - {supplier.primaryContact.title}</div>
                <div>{supplier.primaryContact.email}</div>
                <div>{supplier.primaryContact.phone}</div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">KPIs</h4>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <span className="text-gray-500">Avg Delivery:</span>
                  <span className="ml-1 font-medium">{supplier.kpis.avgDeliveryTime} days</span>
                </div>
                <div>
                  <span className="text-gray-500">Quality Score:</span>
                  <span className="ml-1 font-medium">{supplier.kpis.qualityScore}/5</span>
                </div>
                <div>
                  <span className="text-gray-500">Price Rating:</span>
                  <span className="ml-1 font-medium">{supplier.kpis.priceCompetitiveness}/5</span>
                </div>
                <div>
                  <span className="text-gray-500">Response Time:</span>
                  <span className="ml-1 font-medium">{supplier.kpis.responseTime}h</span>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Terms</h4>
              <div className="text-sm text-gray-600">
                <div>Payment: {supplier.paymentTerms}</div>
                <div>Min Order: {supplier.currency} {supplier.minimumOrder.toLocaleString()}</div>
                {supplier.certifications.length > 0 && (
                  <div>Certifications: {supplier.certifications.join(', ')}</div>
                )}
              </div>
            </div>

            {supplier.notes && (
              <div>
                <h4 className="font-medium text-gray-900 mb-2">Notes</h4>
                <p className="text-sm text-gray-600">{supplier.notes}</p>
              </div>
            )}
          </motion.div>
        )}
      </motion.div>

      {/* Rating Modal */}
      {showRatingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Rate Supplier</h3>
              <button
                onClick={() => setShowRatingModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <ApperIcon name="X" size={20} />
              </button>
            </div>

            <div className="space-y-4 mb-6">
              {renderRatingInput(
                'Delivery Performance',
                ratings.delivery,
                (value) => setRatings(prev => ({ ...prev, delivery: value }))
              )}
              {renderRatingInput(
                'Product Quality',
                ratings.quality,
                (value) => setRatings(prev => ({ ...prev, quality: value }))
              )}
              {renderRatingInput(
                'Pricing Competitiveness',
                ratings.pricing,
                (value) => setRatings(prev => ({ ...prev, pricing: value }))
              )}
              {renderRatingInput(
                'Communication',
                ratings.communication,
                (value) => setRatings(prev => ({ ...prev, communication: value }))
              )}
            </div>

            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setShowRatingModal(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRatingSubmit}
                className="flex-1"
              >
                Save Rating
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

SupplierCard.propTypes = {
  supplier: PropTypes.object.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onUpdateRating: PropTypes.func.isRequired
};

export default SupplierCard;