import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import SectionHeader from '@/components/molecules/SectionHeader';
import ReportsNavigation from '@/components/organisms/ReportsNavigation';
import InventoryReportOrganism from '@/components/organisms/InventoryReportOrganism';
import OrdersReportOrganism from '@/components/organisms/OrdersReportOrganism';
import StockMovementsReportOrganism from '@/components/organisms/StockMovementsReportOrganism';
import ValuationReportOrganism from '@/components/organisms/ValuationReportOrganism';
import AlertMessage from '@/components/atoms/AlertMessage';
import Spinner from '@/components/atoms/Spinner';

import productService from '@/services/api/productService';
import stockLevelService from '@/services/api/stockLevelService';
import orderService from '@/services/api/orderService';
import stockMovementService from '@/services/api/stockMovementService';

const ReportsPage = () => {
  const [products, setProducts] = useState([]);
  const [stockLevels, setStockLevels] = useState([]);
  const [orders, setOrders] = useState([]);
  const [stockMovements, setStockMovements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedReport, setSelectedReport] = useState('inventory');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [productsData, stockData, ordersData, movementsData] = await Promise.all([
        productService.getAll(),
        stockLevelService.getAll(),
        orderService.getAll(),
        stockMovementService.getAll()
      ]);
      setProducts(productsData);
      setStockLevels(stockData);
      setOrders(ordersData);
      setStockMovements(movementsData);
    } catch (err) {
      setError(err.message || 'Failed to load report data');
      toast.error('Failed to load report data');
    } finally {
      setLoading(false);
    }
  };

  const lowStockProducts = products.filter(product => {
    const stock = stockLevels.find(s => s.productId === product.id);
    return stock && stock.quantity <= product.reorderPoint;
  });

  const recentMovements = stockMovements.slice(0, 10);
  const purchaseOrders = orders.filter(o => o.type === 'purchase');
  const salesOrders = orders.filter(o => o.type === 'sales');

  const totalInventoryValue = stockLevels.reduce((total, stock) => {
    const product = products.find(p => p.id === stock.productId);
    return total + (product ? stock.quantity * product.unitPrice : 0);
  }, 0);

  const categoryDistribution = products.reduce((acc, product) => {
    const stock = stockLevels.find(s => s.productId === product.id);
    const value = stock ? stock.quantity * product.unitPrice : 0;
    acc[product.category] = (acc[product.category] || 0) + value;
    return acc;
  }, {});

  if (loading) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="Loader" 
          title="Loading Reports" 
          message={<Spinner className="text-primary-dark" />} 
          className="bg-white py-12"
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <AlertMessage 
          iconName="AlertCircle" 
          title="Error Loading Reports" 
          message={error} 
          actionButton={{ label: 'Retry', onClick: loadData }}
          className="bg-white py-12 text-error"
        />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-full overflow-hidden">
      <SectionHeader 
        title="Reports & Analytics" 
        description="View comprehensive reports and insights" 
      />

      <ReportsNavigation
        selectedReport={selectedReport}
        setSelectedReport={setSelectedReport}
      />

      <div className="space-y-6">
        {selectedReport === 'inventory' && (
          <InventoryReportOrganism 
            products={products} 
            stockLevels={stockLevels} 
            lowStockProducts={lowStockProducts}
          />
        )}
        
        {selectedReport === 'orders' && (
          <OrdersReportOrganism 
            purchaseOrders={purchaseOrders} 
            salesOrders={salesOrders}
          />
        )}
        
        {selectedReport === 'movements' && (
          <StockMovementsReportOrganism 
            movements={recentMovements} 
            products={products}
          />
        )}
        
        {selectedReport === 'valuation' && (
          <ValuationReportOrganism 
            totalValue={totalInventoryValue}
            categoryDistribution={categoryDistribution}
            products={products}
            stockLevels={stockLevels}
          />
        )}
      </div>
    </div>
  );
};

export default ReportsPage;