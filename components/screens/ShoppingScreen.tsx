import React, { useState, useMemo } from 'react';
import { useAppContext } from '../../context/AppContext';
import { ShoppingListItem, StorePrice, ShoppingSuggestion } from '../../types';
import { getShoppingSuggestions } from '../../services/geminiService';
import { PlusCircleIcon, TrashIcon, TagIcon, XIcon, LightbulbIcon, SwapIcon, AlertTriangleIcon } from '../ui/Icons';
import Spinner from '../ui/Spinner';

const ItemDetailModal: React.FC<{
    item: ShoppingListItem;
    onClose: () => void;
    suggestions: ShoppingSuggestion[];
    mockPrices: StorePrice[];
    isLoading: boolean;
}> = ({ item, onClose, suggestions, mockPrices, isLoading }) => {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4 animate-fadeIn">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl w-full max-w-sm p-6 relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200">
                    <XIcon className="w-6 h-6" />
                </button>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-1">{item.name}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-6">{item.quantity}</p>

                {isLoading ? (
                    <div className="text-center py-8">
                        <Spinner />
                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Finding smart swaps...</p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {suggestions.length > 0 && (
                            <div>
                                <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 flex items-center mb-2">
                                    <SwapIcon className="w-5 h-5 mr-2 text-green-500" />
                                    Seasonal & Healthier Swaps
                                </h3>
                                <div className="space-y-3">
                                    {suggestions.map((s, i) => (
                                        <div key={i} className="bg-gray-50 dark:bg-gray-700/50 border dark:border-gray-600 rounded-lg p-3 text-sm">
                                            <p className="font-bold text-gray-800 dark:text-gray-100">{s.alternative}</p>
                                            <p className="text-xs text-gray-600 dark:text-gray-400">{s.reason}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div>
                             <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 mb-2">Price Comparison (Simulated)</h3>
                             <div className="space-y-2">
                                {mockPrices.map((p, i) => (
                                    <div key={i} className="flex justify-between items-center bg-gray-50 dark:bg-gray-700/50 p-3 rounded-lg">
                                        <p className="font-semibold text-gray-800 dark:text-gray-100">{p.storeName}</p>
                                        <div className="text-right">
                                            <p className="font-bold text-gray-800 dark:text-gray-200">₹{p.price.toFixed(2)}</p>
                                            <p className={`text-xs font-semibold ${p.inStock ? 'text-green-500' : 'text-red-500'}`}>
                                                {p.inStock ? 'In Stock' : 'Out of Stock'}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                             </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};


const ShoppingScreen: React.FC = () => {
    const { profile, shoppingList, setShoppingList } = useAppContext();
    const [newItemName, setNewItemName] = useState('');
    const [newItemQuantity, setNewItemQuantity] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [selectedItem, setSelectedItem] = useState<ShoppingListItem | null>(null);
    const [suggestions, setSuggestions] = useState<ShoppingSuggestion[]>([]);
    const [mockPrices, setMockPrices] = useState<StorePrice[]>([]);
    const [isLoadingDetails, setIsLoadingDetails] = useState(false);

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newItemName.trim() || !profile) return;
        setIsAdding(true);

        try {
            const { category } = await getShoppingSuggestions(newItemName, profile);
            
            const newItem: ShoppingListItem = {
                id: new Date().toISOString(),
                name: newItemName.trim(),
                quantity: newItemQuantity.trim() || '1 unit',
                category: category || 'Other',
                purchased: false,
                price: Math.random() * 200 + 50, // Simulated price
            };

            setShoppingList(prev => [...prev, newItem]);
            setNewItemName('');
            setNewItemQuantity('');
        } catch (error) {
            console.error("Failed to add item:", error);
            // Fallback for network error
             const newItem: ShoppingListItem = {
                id: new Date().toISOString(),
                name: newItemName.trim(),
                quantity: newItemQuantity.trim() || '1 unit',
                category: 'Uncategorized',
                purchased: false,
                price: Math.random() * 200 + 50,
            };
            setShoppingList(prev => [...prev, newItem]);
        } finally {
            setIsAdding(false);
        }
    };

    const handleTogglePurchased = (id: string) => {
        setShoppingList(prev =>
            prev.map(item =>
                item.id === id ? { ...item, purchased: !item.purchased } : item
            )
        );
    };

    const handleDeleteItem = (id: string) => {
        setShoppingList(prev => prev.filter(item => item.id !== id));
    };

    const handleClearPurchased = () => {
        setShoppingList(prev => prev.filter(item => !item.purchased));
    };

    const handleItemClick = async (item: ShoppingListItem) => {
        if (!profile) return;
        setSelectedItem(item);
        setIsLoadingDetails(true);
        setSuggestions([]);
        setMockPrices([]);

        // Simulate price fetching
        setTimeout(() => {
             setMockPrices([
                { storeName: 'BigBasket', price: item.price! * 1.05, inStock: Math.random() > 0.1 },
                { storeName: 'Grofers', price: item.price! * 0.98, inStock: Math.random() > 0.2 },
                { storeName: 'Local Mart', price: item.price!, inStock: Math.random() > 0.05 },
            ]);
        }, 300);

        try {
            const { seasonalAlternatives } = await getShoppingSuggestions(item.name, profile);
            setSuggestions(seasonalAlternatives);
        } catch (error) {
            console.error("Failed to fetch suggestions:", error);
        } finally {
            setIsLoadingDetails(false);
        }
    };

    const groupedList = useMemo(() => {
        return shoppingList.reduce((acc, item) => {
            (acc[item.category] = acc[item.category] || []).push(item);
            return acc;
        }, {} as Record<string, ShoppingListItem[]>);
    }, [shoppingList]);
    
    const estimatedTotal = useMemo(() => {
        return shoppingList
            .filter(item => !item.purchased)
            .reduce((total, item) => total + (item.price || 0), 0);
    }, [shoppingList]);
    
    const categoryOrder = ['Produce', 'Protein', 'Dairy', 'Bakery', 'Pantry', 'Frozen', 'Beverages', 'Household', 'Other', 'Uncategorized'];

    return (
        <div className="p-2 space-y-4 h-full flex flex-col">
            <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 px-2">Smart Shopping List</h1>

            <form onSubmit={handleAddItem} className="flex gap-2 items-center">
                <input
                    type="text"
                    value={newItemName}
                    onChange={e => setNewItemName(e.target.value)}
                    placeholder="e.g., Apples, Milk"
                    className="flex-grow px-4 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                 <input
                    type="text"
                    value={newItemQuantity}
                    onChange={e => setNewItemQuantity(e.target.value)}
                    placeholder="Qty (e.g., 1kg)"
                    className="w-28 px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <button type="submit" disabled={isAdding} className="p-2 bg-green-600 text-white rounded-lg disabled:bg-gray-400">
                    {isAdding ? <Spinner /> : <PlusCircleIcon className="w-6 h-6"/>}
                </button>
            </form>

            <div className="flex-grow overflow-y-auto space-y-4">
                 {shoppingList.length === 0 ? (
                    <div className="text-center py-10">
                        <p className="text-gray-500 dark:text-gray-400">Your shopping list is empty.</p>
                        <p className="text-sm text-gray-400 dark:text-gray-500">Add items above to get started!</p>
                    </div>
                ) : (
                    categoryOrder.map(category =>
                        groupedList[category] && (
                            <div key={category}>
                                <h2 className="font-bold text-gray-600 dark:text-gray-300 flex items-center mb-2">
                                    <TagIcon className="w-4 h-4 mr-2" />
                                    {category}
                                </h2>
                                <ul className="space-y-2">
                                    {groupedList[category].map(item => (
                                        <li key={item.id} className="flex items-center bg-white dark:bg-gray-800/50 p-2 rounded-lg shadow-sm">
                                            <input
                                                type="checkbox"
                                                checked={item.purchased}
                                                onChange={() => handleTogglePurchased(item.id)}
                                                className="h-5 w-5 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                            />
                                            <div onClick={() => handleItemClick(item)} className="flex-grow ml-3 cursor-pointer">
                                                <p className={`font-semibold ${item.purchased ? 'line-through text-gray-400 dark:text-gray-500' : 'text-gray-800 dark:text-gray-100'}`}>
                                                    {item.name}
                                                </p>
                                                <p className={`text-xs ${item.purchased ? 'line-through text-gray-500 dark:text-gray-600' : 'text-gray-500 dark:text-gray-400'}`}>
                                                    {item.quantity}
                                                </p>
                                            </div>
                                            <button onClick={() => handleDeleteItem(item.id)} className="text-gray-400 hover:text-red-500 p-1">
                                                <TrashIcon className="w-5 h-5" />
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )
                    )
                )}
            </div>

            <div className="pt-2 border-t dark:border-gray-700 flex justify-between items-center">
                <div className="text-sm">
                    <span className="font-semibold text-gray-600 dark:text-gray-300">Est. Total: </span>
                    <span className="font-bold text-green-700 dark:text-green-400">₹{estimatedTotal.toFixed(2)}</span>
                </div>
                <button onClick={handleClearPurchased} className="px-3 py-1.5 text-xs font-semibold text-red-700 bg-red-100 dark:bg-red-900/50 dark:text-red-200 rounded-lg hover:bg-red-200 dark:hover:bg-red-900">
                    Clear Purchased
                </button>
            </div>
            
            {selectedItem && (
                <ItemDetailModal 
                    item={selectedItem} 
                    onClose={() => setSelectedItem(null)}
                    suggestions={suggestions}
                    mockPrices={mockPrices}
                    isLoading={isLoadingDetails}
                />
            )}
        </div>
    );
};

export default ShoppingScreen;