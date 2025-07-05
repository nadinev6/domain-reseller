import React from 'react';
import { ShoppingCart, X, ArrowRight } from 'lucide-react';
import { useCart } from '../hooks/useCart';
import { useCurrency } from '../context/CurrencyContext';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const { cartItems, removeFromCart, getTotalPrice } = useCart();
  const { formatPrice } = useCurrency();
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div 
        className="absolute inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      ></div>
      
      <div className="fixed inset-y-0 right-0 max-w-full flex">
        <div 
          className="relative w-screen max-w-md bg-white shadow-xl flex flex-col"
          style={{
            animation: isOpen ? 'slideIn 0.3s ease-out forwards' : 'slideOut 0.3s ease-in forwards',
          }}
        >
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900 flex items-center">
              <ShoppingCart size={20} className="mr-2" />
              Your Cart
            </h2>
            <button 
              onClick={onClose}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            >
              <X size={20} />
            </button>
          </div>
          
          <div className="flex-1 overflow-y-auto p-4">
            {true ? ( // Always show coming soon message for now
              <div className="text-center py-10">
                <div className="mx-auto w-16 h-16 text-indigo-400 mb-4">
                  <ShoppingCart size={64} strokeWidth={1.5} className="mx-auto" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">Cart Coming Soon!</h3>
                <p className="text-gray-600 mb-4">
                  We're working hard to bring you an amazing shopping experience. 
                  The cart functionality will be available soon.
                </p>
                <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-indigo-700">
                    🚀 <strong>What's coming:</strong>
                  </p>
                  <ul className="text-sm text-indigo-600 mt-2 space-y-1">
                    <li>• Domain purchase and checkout</li>
                    <li>• Multiple payment options</li>
                    <li>• Order tracking and management</li>
                    <li>• Bulk domain operations</li>
                  </ul>
                </div>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors duration-200"
                >
                  Continue Exploring
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div>
                      <h3 className="font-medium text-gray-800">{item.name}</h3>
                      <p className="text-sm text-gray-500">1 year registration</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="font-medium">{formatPrice(item.price)}</span>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="p-1 rounded-full hover:bg-gray-200 transition-colors duration-200 text-gray-500"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {cartItems.length > 0 && (
            <div className="p-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-4">
                <span className="text-gray-600">Total</span>
                <span className="text-xl font-bold text-gray-900">{formatPrice(getTotalPrice())}</span>
              </div>
              
              <div className="flex items-center text-sm text-amber-600 mb-4">
                <span>You'll earn {Math.floor(getTotalPrice() * 10)} points with this purchase!</span>
              </div>
              
              <button className="w-full py-3 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors duration-200 flex items-center justify-center">
                Proceed to Checkout
                <ArrowRight size={16} className="ml-2" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Cart;