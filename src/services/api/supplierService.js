import mockSuppliers from '../mockData/suppliers.json';

// Local copy of suppliers data
const suppliers = [...mockSuppliers];

// Utility function to simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const supplierService = {
  // Get all suppliers with optional filtering
  async getAll(filters = {}) {
    await delay(300);
    
    let filteredSuppliers = [...suppliers];
    
    // Apply search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.name.toLowerCase().includes(searchTerm) ||
        supplier.email.toLowerCase().includes(searchTerm) ||
        supplier.companyType.toLowerCase().includes(searchTerm) ||
        supplier.categories.some(cat => cat.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      filteredSuppliers = filteredSuppliers.filter(supplier => 
        supplier.status === filters.status
      );
    }
    
    // Apply category filter
    if (filters.category && filters.category !== 'all') {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.categories.includes(filters.category)
      );
    }
    
    // Apply rating filter
    if (filters.minRating) {
      filteredSuppliers = filteredSuppliers.filter(supplier =>
        supplier.rating.overall >= parseFloat(filters.minRating)
      );
    }
    
    // Apply sorting
    if (filters.sortBy) {
      filteredSuppliers.sort((a, b) => {
        switch (filters.sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'rating':
            return b.rating.overall - a.rating.overall;
          case 'created':
            return new Date(b.createdAt) - new Date(a.createdAt);
          case 'updated':
            return new Date(b.updatedAt) - new Date(a.updatedAt);
          default:
            return 0;
        }
      });
    }
    
    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    
    return {
      data: filteredSuppliers.slice(startIndex, endIndex),
      total: filteredSuppliers.length,
      page,
      limit,
      totalPages: Math.ceil(filteredSuppliers.length / limit)
    };
  },

  // Get supplier by ID
  async getById(id) {
    await delay(200);
    const supplier = suppliers.find(s => s.id === parseInt(id));
    if (!supplier) {
      throw new Error('Supplier not found');
    }
    return { ...supplier };
  },

  // Create new supplier
  async create(supplierData) {
    await delay(400);
    
    const newSupplier = {
      ...supplierData,
      id: Date.now(),
      status: 'active',
      rating: {
        overall: 0,
        delivery: 0,
        quality: 0,
        pricing: 0,
        communication: 0
      },
      kpis: {
        avgDeliveryTime: 0,
        onTimeDeliveryRate: 0,
        qualityScore: 0,
        priceCompetitiveness: 0,
        responseTime: 0
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    suppliers.push(newSupplier);
    return { ...newSupplier };
  },

  // Update existing supplier
  async update(id, supplierData) {
    await delay(350);
    
    const index = suppliers.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    suppliers[index] = {
      ...suppliers[index],
      ...supplierData,
      id: parseInt(id),
      updatedAt: new Date().toISOString()
    };
    
    return { ...suppliers[index] };
  },

  // Delete supplier (soft delete by setting inactive)
  async delete(id) {
    await delay(250);
    
    const index = suppliers.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    suppliers[index].status = 'inactive';
    suppliers[index].updatedAt = new Date().toISOString();
    
    return { success: true };
  },

  // Update supplier rating
  async updateRating(id, ratings) {
    await delay(300);
    
    const index = suppliers.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    // Calculate overall rating
    const overall = (ratings.delivery + ratings.quality + ratings.pricing + ratings.communication) / 4;
    
    suppliers[index].rating = {
      ...ratings,
      overall: Math.round(overall * 10) / 10
    };
    suppliers[index].updatedAt = new Date().toISOString();
    
    return { ...suppliers[index] };
  },

  // Update supplier KPIs
  async updateKPIs(id, kpis) {
    await delay(300);
    
    const index = suppliers.findIndex(s => s.id === parseInt(id));
    if (index === -1) {
      throw new Error('Supplier not found');
    }
    
    suppliers[index].kpis = {
      ...suppliers[index].kpis,
      ...kpis
    };
    suppliers[index].updatedAt = new Date().toISOString();
    
    return { ...suppliers[index] };
  },

  // Get supplier statistics
  async getStatistics() {
    await delay(200);
    
    const activeSuppliers = suppliers.filter(s => s.status === 'active');
    const totalSuppliers = suppliers.length;
    const avgRating = activeSuppliers.reduce((sum, s) => sum + s.rating.overall, 0) / activeSuppliers.length;
    const topRatedSuppliers = [...activeSuppliers]
      .sort((a, b) => b.rating.overall - a.rating.overall)
      .slice(0, 5);
    
    // Category distribution
    const categories = {};
    activeSuppliers.forEach(supplier => {
      supplier.categories.forEach(category => {
        categories[category] = (categories[category] || 0) + 1;
      });
    });
    
    return {
      totalSuppliers,
      activeSuppliers: activeSuppliers.length,
      inactiveSuppliers: totalSuppliers - activeSuppliers.length,
      averageRating: Math.round(avgRating * 10) / 10,
      topRatedSuppliers,
      categoryDistribution: categories
    };
  },

  // Get all unique categories
  async getCategories() {
    await delay(150);
    
    const categories = new Set();
    suppliers.forEach(supplier => {
      supplier.categories.forEach(category => categories.add(category));
    });
    
    return Array.from(categories).sort();
  }
};

export default supplierService;