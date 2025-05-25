import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import Sidebar from "@/components/layout/Sidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Edit, Star, Restaurant, CancelCircle, Menu as MenuIcon } from "@/components/ui/icons";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";

export default function VendorSpecialMenu() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [specialItems, setSpecialItems] = useState(() => {
    const savedItems = localStorage.getItem("specialMenuItems");
    if (savedItems) {
      return JSON.parse(savedItems);
    }
    return [
      {
        id: 1,
        name: "Keto Bowl",
        price: "$12.99",
        description: "Low-carb, high-protein meal with grilled chicken, avocado, and mixed greens",
        vegetarian: false,
        available: true
      },
      {
        id: 2,
        name: "Protein Power Plate",
        price: "$14.99",
        description: "Grilled salmon, quinoa, and roasted vegetables",
        vegetarian: false,
        available: true
      },
      {
        id: 3,
        name: "Vegan Buddha Bowl",
        price: "$11.99",
        description: "Assortment of fresh vegetables, tofu, and tahini dressing",
        vegetarian: true,
        available: true
      }
    ];
  });
  const [editItemOpen, setEditItemOpen] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    description: "",
    vegetarian: false,
    available: true
  });
  const { user } = useAuth();
  const { toast } = useToast();

  // Save menu items to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("specialMenuItems", JSON.stringify(specialItems));
  }, [specialItems]);

  const handleAddItem = () => {
    setCurrentItem(null);
    setNewItem({
      name: "",
      price: "",
      description: "",
      vegetarian: false,
      available: true
    });
    setEditItemOpen(true);
  };

  const handleEditItem = (item) => {
    setCurrentItem(item);
    setNewItem({ ...item });
    setEditItemOpen(true);
  };

  const handleSaveItem = () => {
    if (!newItem.name || !newItem.price) {
      toast({
        title: "Error",
        description: "Name and price are required fields",
        variant: "destructive"
      });
      return;
    }

    if (currentItem) {
      // Edit existing item
      setSpecialItems(
        specialItems.map((item) =>
          item.id === currentItem.id ? { ...newItem, id: item.id } : item
        )
      );
      toast({
        title: "Item Updated",
        description: `${newItem.name} has been updated.`,
        variant: "success"
      });
    } else {
      // Add new item
      const newId = Math.max(0, ...specialItems.map(item => item.id)) + 1;
      setSpecialItems([...specialItems, { ...newItem, id: newId }]);
      toast({
        title: "Item Added",
        description: `${newItem.name} has been added to the special menu.`,
        variant: "success"
      });
    }

    setEditItemOpen(false);
  };

  const handleDeleteItem = (id) => {
    setSpecialItems(specialItems.filter(item => item.id !== id));
    toast({
      title: "Item Removed",
      description: "The menu item has been removed.",
      variant: "success"
    });
  };

  const handleToggleAvailability = (id) => {
    setSpecialItems(
      specialItems.map((item) =>
        item.id === id ? { ...item, available: !item.available } : item
      )
    );
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 flex z-40 md:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
            <div className="absolute top-0 right-0 -mr-12 pt-2">
              <button
                type="button"
                className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <CancelCircle className="h-6 w-6 text-white" />
              </button>
            </div>
            <Sidebar onClose={() => setSidebarOpen(false)} />
          </div>
        </div>
      )}
      
      {/* Sidebar for desktop */}
      <div className="hidden md:flex md:flex-shrink-0">
        <Sidebar />
      </div>
      
      {/* Main content */}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {/* Top navigation for mobile */}
        <div className="md:hidden pl-1 pt-1 sm:pl-3 sm:pt-3 flex items-center justify-between bg-white shadow-sm z-10">
          <button 
            type="button" 
            className="-ml-0.5 -mt-0.5 h-12 w-12 inline-flex items-center justify-center rounded-md text-gray-500 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Open sidebar</span>
            <MenuIcon className="h-6 w-6" />
          </button>
          <div className="pr-4">
            <h1 className="text-lg font-bold text-primary-600">MealMate</h1>
          </div>
        </div>
        
        <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none">
          <div className="py-6">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <div className="flex items-center justify-between mb-4">
                <h1 className="text-2xl font-semibold text-gray-900">Special Menu Items</h1>
                <Button 
                  onClick={handleAddItem}
                  className="inline-flex items-center"
                >
                  <span className="mr-1">+</span> Add Special Item
                </Button>
              </div>
              <p className="text-gray-500 mb-6">
                Create special menu items with custom pricing that are available for employees to purchase separately.
              </p>
            </div>
            
            <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
              <Card>
                <CardContent className="p-6">
                  <Table>
                    <TableHeader className="bg-gray-50">
                      <TableRow>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</TableHead>
                        <TableHead className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {specialItems.map(item => (
                        <TableRow key={item.id} className="border-b border-gray-200">
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{item.name}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">{item.price}</TableCell>
                          <TableCell className="px-4 py-4 text-sm text-gray-500 max-w-xs truncate">{item.description}</TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <Badge
                              variant="outline"
                              className={`${
                                item.vegetarian ? "bg-green-100 text-green-800 border-green-200" : "bg-red-100 text-red-800 border-red-200"
                              }`}
                            >
                              {item.vegetarian ? "Vegetarian" : "Non-Vegetarian"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm">
                            <Badge
                              variant={item.available ? "success" : "outline"}
                              className={`${
                                item.available ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}
                            >
                              {item.available ? "Available" : "Unavailable"}
                            </Badge>
                          </TableCell>
                          <TableCell className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex space-x-2">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                onClick={() => handleEditItem(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className={item.available ? "text-red-500" : "text-green-500"}
                                onClick={() => handleToggleAvailability(item.id)}
                              >
                                {item.available ? "Disable" : "Enable"}
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-500"
                                onClick={() => handleDeleteItem(item.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  {specialItems.length === 0 && (
                    <div className="text-center py-8">
                      <Star className="mx-auto h-12 w-12 text-gray-300" />
                      <h3 className="mt-2 text-sm font-medium text-gray-900">No special menu items</h3>
                      <p className="mt-1 text-sm text-gray-500">Get started by creating a new special menu item.</p>
                      <div className="mt-6">
                        <Button onClick={handleAddItem}>
                          <span className="mr-1">+</span> Add Special Item
                        </Button>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>

      {/* Edit/Add Item Dialog */}
      <Dialog open={editItemOpen} onOpenChange={setEditItemOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentItem ? "Edit Special Menu Item" : "Add Special Menu Item"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <div className="space-y-4">
              <div>
                <Label htmlFor="item-name">Item Name</Label>
                <Input 
                  id="item-name" 
                  value={newItem.name}
                  onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                  placeholder="Keto Bowl"
                />
              </div>
              
              <div>
                <Label htmlFor="item-price">Price</Label>
                <Input 
                  id="item-price" 
                  value={newItem.price}
                  onChange={(e) => setNewItem({...newItem, price: e.target.value})}
                  placeholder="$12.99"
                />
              </div>
              
              <div>
                <Label htmlFor="item-description">Description</Label>
                <Textarea 
                  id="item-description" 
                  value={newItem.description}
                  onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                  placeholder="Describe the special menu item..."
                  rows={3}
                />
              </div>
              
              <div>
                <Label>Type</Label>
                <div className="flex space-x-4 mt-2">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="non-veg"
                      name="meal-type"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      checked={!newItem.vegetarian}
                      onChange={() => setNewItem({...newItem, vegetarian: false})}
                    />
                    <Label htmlFor="non-veg" className="ml-2 block text-sm font-medium text-gray-700">
                      Non-Vegetarian
                    </Label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="veg"
                      name="meal-type"
                      className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300"
                      checked={newItem.vegetarian}
                      onChange={() => setNewItem({...newItem, vegetarian: true})}
                    />
                    <Label htmlFor="veg" className="ml-2 block text-sm font-medium text-gray-700">
                      Vegetarian
                    </Label>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="available"
                  name="available"
                  className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  checked={newItem.available}
                  onChange={(e) => setNewItem({...newItem, available: e.target.checked})}
                />
                <Label htmlFor="available" className="ml-2 block text-sm font-medium text-gray-700">
                  Available for ordering
                </Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setEditItemOpen(false)}>
              Cancel
            </Button>
            <Button type="button" onClick={handleSaveItem}>
              {currentItem ? "Save Changes" : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}