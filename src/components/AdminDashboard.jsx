import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Bell } from './Icons';
import './AdminDashboard.css';

const OrderItemsCell = ({ itemsString, orderId, onUpdate, readOnly }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    let parsed = [];
    try {
      parsed = JSON.parse(itemsString);
      if (!Array.isArray(parsed)) parsed = [];
    } catch (e) {
      parsed = [];
    }
    setItems(parsed);
  }, [itemsString]);

  const handleAvailabilityChange = async (index, newAvailability) => {
    const updatedItems = [...items];
    updatedItems[index] = { ...updatedItems[index], availability: newAvailability };
    setItems(updatedItems);

    if (!orderId) return;

    setIsUpdating(true);
    try {
      const response = await fetch(`/api/orders/${orderId}/items`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items: updatedItems })
      });

      if (!response.ok) {
        throw new Error('Failed to update availability');
      }

      if (onUpdate) {
        onUpdate();
      }
    } catch (error) {
      console.error('Error updating item availability:', error);
      alert('Failed to save availability. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  if (items.length === 0) {
    return <span>{itemsString}</span>;
  }

  return (
    <>
      <button
        className="btn-view-items"
        onClick={() => setIsOpen(true)}
      >
        View Items ({items.length})
      </button>

      {isOpen && createPortal(
        <>
          <div className="modal-backdrop" onClick={() => setIsOpen(false)}></div>
          <div className="modal-container animate-fade-in" style={{ zIndex: 1000, maxWidth: '600px', width: '90%' }}>
            <div className="modal-header">
              <h3>Items Ordered</h3>
              <button className="btn-close" onClick={() => setIsOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body" style={{ position: 'relative' }}>
              {isUpdating && (
                <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(255,255,255,0.7)', zIndex: 10, display: 'flex', justifyContent: 'center', alignItems: 'center', borderRadius: '8px' }}>
                  <span style={{ fontWeight: '600', color: '#4f46e5' }}>Saving...</span>
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', gap: '16px' }}>
                    <span style={{ fontWeight: '600', color: '#1e293b', fontSize: '15px', flex: 1, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.Name}</span>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span style={{ backgroundColor: '#e0e7ff', color: '#4f46e5', padding: '4px 12px', borderRadius: '20px', fontSize: '13px', fontWeight: '700', whiteSpace: 'nowrap' }}>
                        Qty: {item.Quantity}
                      </span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', borderLeft: '1px solid #e2e8f0', paddingLeft: '12px', marginLeft: '4px' }}>
                        {readOnly ? (
                          <>
                            {item.availability === 'available' ? (
                              <span style={{ backgroundColor: '#d1fae5', color: '#059669', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>Available</span>
                            ) : item.availability === 'not_available' ? (
                              <span style={{ backgroundColor: '#fee2e2', color: '#ef4444', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>Not Available</span>
                            ) : (
                              <span style={{ backgroundColor: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '6px', fontSize: '12px', fontWeight: '700', textTransform: 'capitalize' }}>Pending</span>
                            )}
                          </>
                        ) : (
                          <>
                            <label className={`custom-checkbox-container success ${isUpdating ? 'disabled' : ''}`}>
                              <input
                                type="radio"
                                name={`availability-${orderId}-${index}`}
                                value="available"
                                checked={item.availability === 'available'}
                                onChange={() => handleAvailabilityChange(index, 'available')}
                                disabled={isUpdating}
                              />
                              <span className="checkmark"></span>
                              Available
                            </label>
                            <label className={`custom-checkbox-container danger ${isUpdating ? 'disabled' : ''}`}>
                              <input
                                type="radio"
                                name={`availability-${orderId}-${index}`}
                                value="not_available"
                                checked={item.availability === 'not_available'}
                                onChange={() => handleAvailabilityChange(index, 'not_available')}
                                disabled={isUpdating}
                              />
                              <span className="checkmark"></span>
                              Not Available
                            </label>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
};

const CustomSelect = ({ value, onChange, options, placeholder }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef(null);

  React.useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedOption = options.find(opt => String(opt.value) === String(value));

  return (
    <div className="custom-select-container" ref={dropdownRef}>
      <div
        className={`form-input custom-select-header ${isOpen ? 'open' : ''}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className={selectedOption ? 'text-primary' : 'text-placeholder'}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <svg className={`custom-select-arrow ${isOpen ? 'open' : ''}`} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9l6 6 6-6" /></svg>
      </div>
      {isOpen && (
        <div className="custom-select-dropdown animate-fade-in">
          <div
            className={`custom-select-option ${!value ? 'selected' : ''}`}
            onClick={() => {
              onChange('');
              setIsOpen(false);
            }}
          >
            {placeholder}
          </div>
          {options.map(option => (
            <div
              key={option.value}
              className={`custom-select-option ${String(option.value) === String(value) ? 'selected' : ''}`}
              onClick={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default function AdminDashboard({ onLogout, adminUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Menu Modal State
  const [isMenuModalOpen, setIsMenuModalOpen] = useState(false);
  const [menuName, setMenuName] = useState('');
  const [menuStatus, setMenuStatus] = useState('Active');
  const [editingMenuId, setEditingMenuId] = useState(null);

  // Dashboard Tabs
  const isNilla = adminUser?.toLowerCase() === 'nilla' || adminUser?.toLowerCase() === 'nila';
  const [activeTab, setActiveTab] = useState(isNilla ? 'orders-details' : 'orders');

  const [menus, setMenus] = useState([]);
  const [menusLoading, setMenusLoading] = useState(true);

  // Content State
  const [contents, setContents] = useState([]);
  const [contentsLoading, setContentsLoading] = useState(true);

  // Subscribers State
  const [subscribers, setSubscribers] = useState([]);
  const [subscribersLoading, setSubscribersLoading] = useState(true);

  // Combo Offers State
  const [comboOffers, setComboOffers] = useState([]);
  const [comboOffersLoading, setComboOffersLoading] = useState(true);

  // Content Modal State
  const [isContentModalOpen, setIsContentModalOpen] = useState(false);
  const [editingContentId, setEditingContentId] = useState(null);
  const [contentForm, setContentForm] = useState({
    menu_id: '',
    menu_name: '',
    menu_name_tamil: '',
    amount: '',
    imageFile: null,
    imageName: '',
    existingImage: '',
    content_text_english: '',
    content_text_tamil: '',
    ingredients_text_english: '',
    ingredients_text_tamil: '',
    net_weight: '',
    shelf_life: ''
  });

  // Combo Offer Modal State
  const [isComboModalOpen, setIsComboModalOpen] = useState(false);
  const [editingComboId, setEditingComboId] = useState(null);
  const [comboForm, setComboForm] = useState({
    name: '',
    amount: '',
    imageFile: null,
    imageName: '',
    existingImage: ''
  });

  // Delete Confirm Modal State
  const [deleteConfirmModal, setDeleteConfirmModal] = useState({ isOpen: false, id: null, type: null });

  // Toast Notification State
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // Pagination State for Menus
  const [menuCurrentPage, setMenuCurrentPage] = useState(1);
  const menusPerPage = 3;

  const indexOfLastMenu = menuCurrentPage * menusPerPage;
  const indexOfFirstMenu = indexOfLastMenu - menusPerPage;
  const currentMenus = menus.slice(indexOfFirstMenu, indexOfLastMenu);
  const totalMenuPages = Math.ceil(menus.length / menusPerPage);

  // Pagination State for Contents
  const [contentCurrentPage, setContentCurrentPage] = useState(1);
  const contentsPerPage = 3;
  const [contentFilterMenuId, setContentFilterMenuId] = useState('');

  const filteredContents = contents.filter(content => {
    if (contentFilterMenuId) {
      return content.menu_id.toString() === contentFilterMenuId;
    }
    return true;
  });

  const indexOfLastContent = contentCurrentPage * contentsPerPage;
  const indexOfFirstContent = indexOfLastContent - contentsPerPage;
  const currentContents = filteredContents.slice(indexOfFirstContent, indexOfLastContent);
  const totalContentPages = Math.ceil(filteredContents.length / contentsPerPage);

  // Pagination State for Subscribers
  const [subscriberCurrentPage, setSubscriberCurrentPage] = useState(1);
  const subscribersPerPage = 5;
  const indexOfLastSubscriber = subscriberCurrentPage * subscribersPerPage;
  const indexOfFirstSubscriber = indexOfLastSubscriber - subscribersPerPage;
  const currentSubscribers = subscribers.slice(indexOfFirstSubscriber, indexOfLastSubscriber);
  const totalSubscriberPages = Math.ceil(subscribers.length / subscribersPerPage);

  // Pagination State for Combo Offers
  const [comboCurrentPage, setComboCurrentPage] = useState(1);
  const comboOffersPerPage = 5;
  const indexOfLastCombo = comboCurrentPage * comboOffersPerPage;
  const indexOfFirstCombo = indexOfLastCombo - comboOffersPerPage;
  const currentComboOffers = comboOffers.slice(indexOfFirstCombo, indexOfLastCombo);
  const totalComboPages = Math.ceil(comboOffers.length / comboOffersPerPage);

  const [homeSearchQuery, setHomeSearchQuery] = useState('');
  const [homeFilterDate, setHomeFilterDate] = useState('');
  const [homeFilterStatus, setHomeFilterStatus] = useState('All');
  const [detailsSearchQuery, setDetailsSearchQuery] = useState('');
  const [detailsFilterDate, setDetailsFilterDate] = useState('');
  const [detailsFilterStatus, setDetailsFilterStatus] = useState('All');

  // Pagination State for Orders
  const [ordersCurrentPage, setOrdersCurrentPage] = useState(1);
  const ordersPerPage = 3;

  const filteredOrders = orders.filter(order => {
    const currentQuery = activeTab === 'orders' ? homeSearchQuery : (activeTab === 'orders-details' ? detailsSearchQuery : '');
    const currentDateQuery = activeTab === 'orders' ? homeFilterDate : (activeTab === 'orders-details' ? detailsFilterDate : '');
    const currentStatusQuery = activeTab === 'orders' ? homeFilterStatus : (activeTab === 'orders-details' ? detailsFilterStatus : 'All');

    let matchesSearch = true;
    if (currentQuery !== '') {
      const query = currentQuery.toLowerCase().trim();
      const orderNum = order.order_number ? String(order.order_number).toLowerCase() : '';
      const formattedOrderNum = `#valam-${orderNum}`;
      matchesSearch = orderNum.includes(query) || formattedOrderNum.includes(query) || (order.id && String(order.id) === query);
    }

    let matchesDate = true;
    if (currentDateQuery !== '') {
      if (order.created_date) {
        const orderDateObj = new Date(order.created_date);
        if (!isNaN(orderDateObj)) {
          const yyyy = orderDateObj.getFullYear();
          const mm = String(orderDateObj.getMonth() + 1).padStart(2, '0');
          const dd = String(orderDateObj.getDate()).padStart(2, '0');
          const orderDateString = `${yyyy}-${mm}-${dd}`;
          matchesDate = orderDateString === currentDateQuery;
        } else {
          matchesDate = false;
        }
      } else {
        matchesDate = false;
      }
    }

    let matchesStatus = true;
    if (currentStatusQuery !== 'All') {
      const status = order.Order_status || order.order_status || 'Pending';
      const isCompleted = status.toLowerCase() === 'completed' || status.toLowerCase() === 'cpmplted';
      const normalizedStatus = isCompleted ? 'Completed' : 'Pending';
      matchesStatus = normalizedStatus === currentStatusQuery;
    }

    return matchesSearch && matchesDate && matchesStatus;
  });

  const indexOfLastOrder = ordersCurrentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalOrderPages = Math.ceil(filteredOrders.length / ordersPerPage);

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'success' });
    }, 3000);
  };

  useEffect(() => {
    fetchOrders();
    fetchMenus();
    fetchContents();
    fetchSubscribers();
    fetchComboOffers();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders');
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSubscribers = async () => {
    try {
      setSubscribersLoading(true);
      const response = await fetch('/api/subscribers');
      if (!response.ok) {
        throw new Error('Failed to fetch subscribers');
      }
      const data = await response.json();
      setSubscribers(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setSubscribersLoading(false);
    }
  };

  const fetchComboOffers = async () => {
    try {
      setComboOffersLoading(true);
      const response = await fetch('/api/combo-offers');
      if (!response.ok) {
        throw new Error('Failed to fetch combo offers');
      }
      const data = await response.json();
      setComboOffers(data);
    } catch (err) {
      console.error(err.message);
    } finally {
      setComboOffersLoading(false);
    }
  };

  const handleOrderSubmit = async (orderId) => {
    try {
      const response = await fetch(`/api/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'Completed' })
      });
      if (response.ok) {
        showToast('Order status updated to Completed!');
        fetchOrders();
      } else {
        showToast('Failed to update order status', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Error updating order status', 'error');
    }
  };

  const fetchMenus = async () => {
    try {
      setMenusLoading(true);
      const response = await fetch('/api/menus');
      if (!response.ok) throw new Error('Failed to fetch menus');
      const data = await response.json();
      setMenus(data);
    } catch (err) {
      console.error(err);
    } finally {
      setMenusLoading(false);
    }
  };

  const fetchContents = async () => {
    try {
      setContentsLoading(true);
      const response = await fetch('/api/contents');
      if (!response.ok) throw new Error('Failed to fetch contents');
      const data = await response.json();
      setContents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setContentsLoading(false);
    }
  };

  const openCreateMenuModal = () => {
    setEditingMenuId(null);
    setMenuName('');
    setMenuStatus('Active');
    setIsMenuModalOpen(true);
  };

  const openEditMenuModal = (menu) => {
    setEditingMenuId(menu.menu_id);
    setMenuName(menu.menu_name);
    setMenuStatus(menu.status);
    setIsMenuModalOpen(true);
  };

  const handleSaveMenu = async () => {
    if (!menuName.trim()) {
      showToast("⚠️ Please enter a menu name!", "error");
      return;
    }

    try {
      const url = editingMenuId ? `/api/menus/${editingMenuId}` : '/api/menus';
      const method = editingMenuId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ menuName, status: menuStatus })
      });

      if (response.ok) {
        showToast(editingMenuId ? `✨ Menu '${menuName}' updated successfully!` : `🎉 Menu '${menuName}' has been added successfully!`);
        setIsMenuModalOpen(false);
        setMenuName('');
        setEditingMenuId(null);
        fetchMenus(); // Refresh the list
      } else {
        const errorData = await response.json();
        showToast(`Failed to save menu: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(`Error saving menu: ${err.message}`, 'error');
    }
  };

  const openCreateContentModal = () => {
    setEditingContentId(null);
    setContentForm({
      menu_id: '',
      menu_name: '',
      menu_name_tamil: '',
      amount: '',
      imageFile: null,
      imageName: '',
      existingImage: '',
      content_text_english: '',
      content_text_tamil: '',
      ingredients_text_english: '',
      ingredients_text_tamil: '',
      net_weight: '',
      shelf_life: ''
    });
    setIsContentModalOpen(true);
  };

  const openEditContentModal = (content) => {
    setEditingContentId(content.content_id);
    setContentForm({
      menu_id: content.menu_id,
      menu_name: content.menu_name,
      menu_name_tamil: content.menu_name_tamil || '',
      amount: content.amount,
      imageFile: null,
      imageName: '',
      existingImage: content.image || '',
      content_text_english: content.content_text_english,
      content_text_tamil: content.content_text_tamil,
      ingredients_text_english: content.ingredients_text_english || '',
      ingredients_text_tamil: content.ingredients_text_tamil || '',
      net_weight: content.net_weight || '',
      shelf_life: content.shelf_life || ''
    });
    setIsContentModalOpen(true);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setContentForm({
          ...contentForm,
          imageFile: reader.result,
          imageName: file.name
        });
      };
      reader.readAsDataURL(file);
    } else {
      setContentForm({
        ...contentForm,
        imageFile: null,
        imageName: ''
      });
    }
  };

  const handleSaveContent = async () => {
    if (!contentForm.menu_id) {
      showToast("⚠️ Please select a Menu!", "error");
      return;
    }
    if (!contentForm.menu_name_tamil?.trim()) {
      showToast("⚠️ Please enter Menu Name (Tamil)!", "error");
      return;
    }
    if (!contentForm.amount) {
      showToast("⚠️ Please enter Amount!", "error");
      return;
    }
    if (!contentForm.content_text_english?.trim()) {
      showToast("⚠️ Please enter Content Text (English)!", "error");
      return;
    }
    if (!contentForm.content_text_tamil?.trim()) {
      showToast("⚠️ Please enter Content Text (Tamil)!", "error");
      return;
    }

    // Prevent duplicate content for the same Menu
    const isDuplicate = contents.some(c =>
      c.menu_id.toString() === contentForm.menu_id.toString() &&
      c.content_id !== editingContentId
    );

    if (isDuplicate) {
      showToast("⚠️ Content for this Menu already exists! Please edit the existing one.", "error");
      return;
    }

    try {
      const url = editingContentId ? `/api/contents/${editingContentId}` : '/api/contents';
      const method = editingContentId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contentForm)
      });

      if (response.ok) {
        showToast(editingContentId ? `✨ Content updated successfully!` : `🎉 Content has been added successfully!`);
        setIsContentModalOpen(false);
        setEditingContentId(null);
        fetchContents();
      } else {
        const errorData = await response.json();
        showToast(`Failed to save content: ${errorData.error || 'Unknown error'}`, 'error');
      }
    } catch (err) {
      console.error(err);
      showToast(`Error saving content: ${err.message}`, 'error');
    }
  };

  const openAddComboModal = (offer = null) => {
    if (offer) {
      setEditingComboId(offer.combo_offer_id);
      setComboForm({
        name: offer.combo_offer_name || '',
        amount: offer.combo_offer_amount,
        imageFile: null,
        imageName: '',
        existingImage: offer.combo_offer_image || ''
      });
    } else {
      setEditingComboId(null);
      setComboForm({ name: '', amount: '', imageFile: null, imageName: '', existingImage: '' });
    }
    setIsComboModalOpen(true);
  };

  const closeComboModal = () => {
    setIsComboModalOpen(false);
  };

  const handleComboImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setComboForm(prev => ({
          ...prev,
          imageFile: reader.result,
          imageName: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleComboSubmit = async (e) => {
    e.preventDefault();
    if (!comboForm.name || !comboForm.amount || (!comboForm.imageFile && !comboForm.existingImage)) {
      showToast("⚠️ Please enter Name, Amount, and upload an Image!", "error");
      return;
    }

    try {
      const url = editingComboId 
        ? `/api/combo-offers/${editingComboId}` 
        : '/api/combo-offers';
      
      const method = editingComboId ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: comboForm.name,
          amount: comboForm.amount,
          imageFile: comboForm.imageFile,
          imageName: comboForm.imageName,
          existingImage: comboForm.existingImage
        })
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData.error || 'Failed to save combo offer');
      }

      showToast(editingComboId ? "🎉 Combo Offer updated successfully!" : "🎉 Combo Offer has been added successfully!");
      closeComboModal();
      fetchComboOffers(); // Refresh the list
    } catch (err) {
      console.error(err);
      showToast(`Error saving combo offer: ${err.message}`, 'error');
    }
  };

  const handleDelete = (id, type) => {
    setDeleteConfirmModal({ isOpen: true, id, type });
  };

  const confirmDelete = async () => {
    const { id, type } = deleteConfirmModal;
    if (!id || !type) return;

    try {
      let url = '';
      let successMessage = '';
      
      if (type === 'comboOffer') {
        url = `/api/combo-offers/${id}`;
        successMessage = "🗑️ Combo Offer has been deleted successfully!";
      } else if (type === 'menu') {
        url = `/api/menus/${id}`;
        successMessage = "🗑️ Menu has been deleted successfully!";
      } else if (type === 'content') {
        url = `/api/contents/${id}`;
        successMessage = "🗑️ Content has been deleted successfully!";
      }

      const response = await fetch(url, { method: 'DELETE' });
      if (!response.ok) {
        throw new Error('Failed to delete item');
      }
      showToast(successMessage);
      
      if (type === 'comboOffer') fetchComboOffers();
      else if (type === 'menu') fetchMenus();
      else if (type === 'content') fetchContents();

    } catch (err) {
      console.error(err);
      showToast(`Error deleting item: ${err.message}`, 'error');
    } finally {
      setDeleteConfirmModal({ isOpen: false, id: null, type: null });
    }
  };

  const hasPendingOrders = orders.some(order => {
    const status = order.Order_status || order.order_status || 'Pending';
    return status.toLowerCase() === 'pending';
  });

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast-notification ${toast.type}`}>
          {toast.type === 'success' ? (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
          ) : (
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg>
          )}
          <span>{toast.message}</span>
        </div>
      )}

      <div className="admin-top-bar">
        {/* Left Side - Logo */}
        <div className="admin-logo-section">
          <div className="admin-brand-logo">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22V12" />
              <path d="M12 12C12 7 17 2 22 2C22 7 17 12 12 12Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 16C12 12 8 8 3 8C3 12 8 16 12 16Z" fill="currentColor" fillOpacity="0.25" />
              <path d="M12 22C12 18 15 15 19 15C19 18 15 22 12 22Z" fill="currentColor" fillOpacity="0.15" />
            </svg>
          </div>
          <div className="admin-logo-text">
            <span className="brand-name">VALAM FOODS</span>
          </div>
        </div>

        {/* Center - Navigation */}
        <nav className="admin-nav">
          {!isNilla && (
            <span className={`admin-nav-link ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>Home</span>
          )}
          <span className={`admin-nav-link ${activeTab === 'orders-details' ? 'active' : ''}`} onClick={() => setActiveTab('orders-details')}>Orders Details</span>
          {!isNilla && (
            <>
              <span className={`admin-nav-link ${activeTab === 'menu-list' ? 'active' : ''}`} onClick={() => setActiveTab('menu-list')}>Menu</span>
              <span className={`admin-nav-link ${activeTab === 'content-list' ? 'active' : ''}`} onClick={() => setActiveTab('content-list')}>Content</span>
              <span className={`admin-nav-link ${activeTab === 'subscribers' ? 'active' : ''}`} onClick={() => setActiveTab('subscribers')}>Subscribe Mail</span>
              <span className={`admin-nav-link ${activeTab === 'combo-offers' ? 'active' : ''}`} onClick={() => setActiveTab('combo-offers')}>Combo Offer</span>
            </>
          )}
          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Notification Button */}
            <button 
              className="btn-icon" 
              onClick={() => setActiveTab('orders')} 
              title="Pending Orders" 
              style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: '0', color: '#475569', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}
            >
              <Bell className="w-6 h-6" />
              {hasPendingOrders && (
                <span className="notification-blink"></span>
              )}
            </button>

            {/* Logout Button inside Nav for mobile responsiveness */}
            <button className="logout-nav-btn" onClick={onLogout} title="Logout" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: '0', color: '#ef4444', border: '1px solid #fee2e2', backgroundColor: '#fef2f2', borderRadius: '50%', transition: 'all 0.2s', cursor: 'pointer' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path><polyline points="16 17 21 12 16 7"></polyline><line x1="21" y1="12" x2="9" y2="12"></line></svg>
            </button>
          </div>
        </nav>
      </div>

      <div className="dashboard-content glass">
        {activeTab === 'orders' && (
          <>
            <div className="section-header-flex">
              <h4 className="section-title" style={{ margin: 0 }}>All Orders</h4>
              <div className="filter-input-container">
                <div className="filter-input-wrapper">
                  <select
                    value={homeFilterStatus}
                    onChange={(e) => {
                      setHomeFilterStatus(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input status-select"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="filter-input-wrapper">
                  <input
                    type="date"
                    value={homeFilterDate}
                    onChange={(e) => {
                      setHomeFilterDate(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input date-input"
                  />
                </div>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by Order Number..."
                    value={homeSearchQuery}
                    onChange={(e) => {
                      setHomeSearchQuery(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input search-input"
                  />
                  <svg className="filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loader-container">
                <span className="loader-spinner">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="btn btn-primary btn-sm" onClick={fetchOrders}>Retry</button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="no-orders" style={{ textAlign: 'center', padding: '40px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                {orders.length === 0 ? "No orders found in the database." : "No orders found matching your search."}
              </p>
            ) : (
              <div className="orders-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '10px' }}>
                {currentOrders.map((order) => (
                  <div key={order.id} className="order-detail-card glass" style={{
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    background: 'var(--bg-primary, #ffffff)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    border: '1px solid var(--border-color, #e2e8f0)'
                  }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', padding: '16px', borderRadius: '12px', border: 'none', marginBottom: '8px', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)', position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1 }}>Order Number</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', zIndex: 1 }}>#{order.order_number}</span>
                        {/* Decorative circle to match the profile style from first image */}
                        <div style={{ position: 'absolute', bottom: '-20px', right: '10px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', zIndex: 0 }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.created_date ? new Date(order.created_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>ID</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.id}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Name</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Mobile</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.mobile}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.city}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</span>
                        <div className="items-cell">
                          <OrderItemsCell itemsString={order.items} orderId={order.id} onUpdate={fetchOrders} readOnly={true} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                        {(() => {
                          const status = order.Order_status || order.order_status || 'Pending';
                          const isCompleted = status.toLowerCase() === 'completed' || status.toLowerCase() === 'cpmplted';
                          return (
                            <span
                              style={{
                                backgroundColor: isCompleted ? '#d1fae5' : '#fef3c7',
                                color: isCompleted ? '#059669' : '#d97706',
                                fontWeight: '700',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                border: isCompleted ? '1px solid #a7f3d0' : '1px solid #fde68a'
                              }}
                            >
                              {status}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {totalOrderPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setOrdersCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={ordersCurrentPage === 1}
                  title="Previous Page"
                  style={{ opacity: ordersCurrentPage === 1 ? 0.5 : 1, cursor: ordersCurrentPage === 1 ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  Page {ordersCurrentPage} of {totalOrderPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setOrdersCurrentPage(prev => Math.min(prev + 1, totalOrderPages))}
                  disabled={ordersCurrentPage === totalOrderPages}
                  title="Next Page"
                  style={{ opacity: ordersCurrentPage === totalOrderPages ? 0.5 : 1, cursor: ordersCurrentPage === totalOrderPages ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'orders-details' && (
          <>
            <div className="section-header-flex">
              <h4 className="section-title" style={{ textTransform: 'uppercase', margin: 0 }}>Orders Details</h4>
              <div className="filter-input-container">
                <div className="filter-input-wrapper">
                  <select
                    value={detailsFilterStatus}
                    onChange={(e) => {
                      setDetailsFilterStatus(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input status-select"
                  >
                    <option value="All">All Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                <div className="filter-input-wrapper">
                  <input
                    type="date"
                    value={detailsFilterDate}
                    onChange={(e) => {
                      setDetailsFilterDate(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input date-input"
                  />
                </div>
                <div className="filter-input-wrapper">
                  <input
                    type="text"
                    placeholder="Search by Order Number..."
                    value={detailsSearchQuery}
                    onChange={(e) => {
                      setDetailsSearchQuery(e.target.value);
                      setOrdersCurrentPage(1);
                    }}
                    className="filter-input search-input"
                  />
                  <svg className="filter-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
                </div>
              </div>
            </div>

            {loading ? (
              <div className="loader-container">
                <span className="loader-spinner">Loading orders...</span>
              </div>
            ) : error ? (
              <div className="error-message">
                <p>{error}</p>
                <button className="btn btn-primary btn-sm" onClick={fetchOrders}>Retry</button>
              </div>
            ) : filteredOrders.length === 0 ? (
              <p className="no-orders" style={{ textAlign: 'center', padding: '40px', color: '#64748b', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px dashed #cbd5e1' }}>
                {orders.length === 0 ? "No orders found in the database." : "No orders found matching your search."}
              </p>
            ) : (
              <div className="orders-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '24px', padding: '10px' }}>
                {currentOrders.map((order) => (
                  <div key={order.id} className="order-detail-card glass" style={{
                    padding: '24px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '16px',
                    background: 'var(--bg-primary, #ffffff)',
                    boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.01)',
                    border: '1px solid var(--border-color, #e2e8f0)'
                  }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', paddingBottom: '12px' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', padding: '16px', borderRadius: '12px', border: 'none', marginBottom: '8px', boxShadow: '0 4px 10px rgba(30, 58, 138, 0.2)', position: 'relative', overflow: 'hidden' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: '#93c5fd', textTransform: 'uppercase', letterSpacing: '0.5px', zIndex: 1 }}>Order Number</span>
                        <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', zIndex: 1 }}>#{order.order_number}</span>
                        {/* Decorative circle to match the profile style from first image */}
                        <div style={{ position: 'absolute', bottom: '-20px', right: '10px', width: '60px', height: '60px', borderRadius: '50%', backgroundColor: 'rgba(255, 255, 255, 0.05)', zIndex: 0 }}></div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Date</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.created_date ? new Date(order.created_date).toLocaleDateString('en-GB') : 'N/A'}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Customer Name</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.name}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>City</span>
                        <span style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-primary, #1e293b)', textAlign: 'right' }}>{order.city}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Items Ordered</span>
                        <div className="items-cell">
                          <OrderItemsCell itemsString={order.items} orderId={order.id} onUpdate={fetchOrders} readOnly={false} />
                        </div>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontSize: '12px', fontWeight: '700', color: 'var(--text-muted, #64748b)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status</span>
                        {(() => {
                          const status = order.Order_status || order.order_status || 'Pending';
                          const isCompleted = status.toLowerCase() === 'completed' || status.toLowerCase() === 'cpmplted';
                          return (
                            <span
                              style={{
                                backgroundColor: isCompleted ? '#d1fae5' : '#fef3c7',
                                color: isCompleted ? '#059669' : '#d97706',
                                fontWeight: '700',
                                padding: '6px 12px',
                                borderRadius: '8px',
                                fontSize: '12px',
                                border: isCompleted ? '1px solid #a7f3d0' : '1px solid #fde68a'
                              }}
                            >
                              {status}
                            </span>
                          );
                        })()}
                      </div>
                    </div>
                    {(() => {
                      const status = order.Order_status || order.order_status || 'Pending';
                      const isCompleted = status.toLowerCase() === 'completed' || status.toLowerCase() === 'cpmplted';
                      
                      let allItemsChecked = false;
                      try {
                        const items = JSON.parse(order.items || '[]');
                        if (items.length > 0) {
                          allItemsChecked = items.every(item => item.availability === 'available' || item.availability === 'not_available');
                        }
                      } catch(e) {
                        allItemsChecked = false;
                      }

                      if (!isCompleted) {
                        return (
                          <button 
                            className="btn btn-success btn-sm" 
                            onClick={() => handleOrderSubmit(order.id)} 
                            disabled={!allItemsChecked}
                            title={!allItemsChecked ? "Please verify availability of all items before submitting" : ""}
                            style={{ 
                              width: '100%', 
                              fontWeight: '700', 
                              padding: '10px 16px', 
                              borderRadius: '8px', 
                              fontSize: '13px', 
                              background: allItemsChecked ? 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' : '#cbd5e1', 
                              color: allItemsChecked ? 'white' : '#64748b', 
                              border: 'none', 
                              cursor: allItemsChecked ? 'pointer' : 'not-allowed', 
                              boxShadow: allItemsChecked ? '0 4px 10px rgba(30, 58, 138, 0.2)' : 'none', 
                              transition: 'all 0.2s' 
                            }}>
                            Order Submit
                          </button>
                        );
                      }
                      return null;
                    })()}
                  </div>
                ))}
              </div>
            )}

            {totalOrderPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setOrdersCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={ordersCurrentPage === 1}
                  title="Previous Page"
                  style={{ opacity: ordersCurrentPage === 1 ? 0.5 : 1, cursor: ordersCurrentPage === 1 ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  Page {ordersCurrentPage} of {totalOrderPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setOrdersCurrentPage(prev => Math.min(prev + 1, totalOrderPages))}
                  disabled={ordersCurrentPage === totalOrderPages}
                  title="Next Page"
                  style={{ opacity: ordersCurrentPage === totalOrderPages ? 0.5 : 1, cursor: ordersCurrentPage === totalOrderPages ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'menu-list' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 className="section-title" style={{ marginBottom: 0 }}>Menu List</h4>
              <button className="btn btn-primary" onClick={openCreateMenuModal} title="Create Menu" style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Menu Name</th>
                    <th>Created Date</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {menusLoading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading menus...</td></tr>
                  ) : menus.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No menus found.</td></tr>
                  ) : (
                    currentMenus.map((menu) => (
                      <tr key={menu.menu_id}>
                        <td data-label="ID">{menu.menu_id}</td>
                        <td data-label="Menu Name"><span style={{ fontWeight: '600', color: '#1e293b' }}>{menu.menu_name}</span></td>
                        <td data-label="Created Date">{menu.created_date ? new Date(menu.created_date).toLocaleDateString('en-GB') : 'N/A'}</td>
                        <td data-label="Status"><span className={`status-label ${menu.status === 'Active' ? 'active' : 'inactive'}`}>{menu.status}</span></td>
                        <td data-label="Actions" style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => openEditMenuModal(menu)} title="Edit Menu" style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(menu.menu_id, 'menu')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', padding: 0, borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                            title="Delete Menu"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalMenuPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMenuCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={menuCurrentPage === 1}
                  title="Previous Page"
                  style={{ opacity: menuCurrentPage === 1 ? 0.5 : 1, cursor: menuCurrentPage === 1 ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  Page {menuCurrentPage} of {totalMenuPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setMenuCurrentPage(prev => Math.min(prev + 1, totalMenuPages))}
                  disabled={menuCurrentPage === totalMenuPages}
                  title="Next Page"
                  style={{ opacity: menuCurrentPage === totalMenuPages ? 0.5 : 1, cursor: menuCurrentPage === totalMenuPages ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}

        {activeTab === 'content-list' && (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h4 className="section-title" style={{ marginBottom: 0 }}>Content List</h4>
              <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
                <div style={{ width: '250px' }}>
                  <CustomSelect
                    value={contentFilterMenuId}
                    options={[
                      { value: '', label: 'All Menus' },
                      ...menus.filter(m => m.status === 'Active').map(menu => ({
                        value: menu.menu_id.toString(),
                        label: menu.menu_name
                      }))
                    ]}
                    onChange={(val) => {
                      setContentFilterMenuId(val);
                      setContentCurrentPage(1); // Reset page on filter
                    }}
                  />
                </div>
                <button className="btn btn-primary" onClick={openCreateContentModal} title="Create Content" style={{ width: '42px', height: '42px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                </button>
              </div>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Menu Name</th>
                    <th>Amount</th>
                    <th>Image</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {contentsLoading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading contents...</td></tr>
                  ) : contents.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No contents found.</td></tr>
                  ) : (
                    currentContents.map((content) => (
                      <tr key={content.content_id}>
                        <td data-label="ID">{content.content_id}</td>
                        <td data-label="Menu Name"><span style={{ fontWeight: '600', color: '#1e293b' }}>{content.actual_menu_name || content.menu_name}</span></td>
                        <td data-label="Amount">₹{content.amount}</td>
                        <td data-label="Image">{content.image ? content.image : 'No Image'}</td>
                        <td data-label="Created Date">{content.created_date ? new Date(content.created_date).toLocaleDateString('en-GB') : 'N/A'}</td>
                        <td data-label="Actions" style={{ display: 'flex', gap: '8px' }}>
                          <button className="btn btn-primary btn-sm" onClick={() => openEditContentModal(content)} title="Edit Content" style={{ width: '34px', height: '34px', borderRadius: '50%', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0 }}>
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(content.content_id, 'content')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '34px', height: '34px', padding: 0, borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                            title="Delete Content"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalContentPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setContentCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={contentCurrentPage === 1}
                  title="Previous Page"
                  style={{ opacity: contentCurrentPage === 1 ? 0.5 : 1, cursor: contentCurrentPage === 1 ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  Page {contentCurrentPage} of {totalContentPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setContentCurrentPage(prev => Math.min(prev + 1, totalContentPages))}
                  disabled={contentCurrentPage === totalContentPages}
                  title="Next Page"
                  style={{ opacity: contentCurrentPage === totalContentPages ? 0.5 : 1, cursor: contentCurrentPage === totalContentPages ? 'not-allowed' : 'pointer', width: '36px', height: '36px', display: 'flex', justifyContent: 'center', alignItems: 'center', padding: 0, borderRadius: '10px' }}
                >
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </>
        )}

        {/* --- SUBSCRIBERS LIST TAB --- */}
        {activeTab === 'subscribers' && (
          <div className="admin-content-section animate-slide-up">
            <div className="section-header" style={{ marginBottom: '24px' }}>
              <h2 className="section-title">SUBSCRIBERS LIST</h2>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Email ID</th>
                    <th>Created Date</th>
                  </tr>
                </thead>
                <tbody>
                  {subscribersLoading ? (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>Loading subscribers...</td></tr>
                  ) : subscribers.length === 0 ? (
                    <tr><td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No subscribers found.</td></tr>
                  ) : (
                    currentSubscribers.map((sub) => (
                      <tr key={sub.Subscribe_id}>
                        <td data-label="ID">{sub.Subscribe_id}</td>
                        <td data-label="Email ID"><span style={{ fontWeight: '500', color: '#1e293b' }}>{sub.email_id}</span></td>
                        <td data-label="Created Date">{sub.created_date ? new Date(sub.created_date).toLocaleString('en-GB') : 'N/A'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalSubscriberPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSubscriberCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={subscriberCurrentPage === 1}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Page {subscriberCurrentPage} of {totalSubscriberPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setSubscriberCurrentPage(prev => Math.min(prev + 1, totalSubscriberPages))}
                  disabled={subscriberCurrentPage === totalSubscriberPages}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </div>
        )}

        {/* --- COMBO OFFERS LIST TAB --- */}
        {activeTab === 'combo-offers' && (
          <div className="admin-content-section animate-slide-up">
            <div className="section-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <h2 className="section-title">COMBO OFFERS LIST</h2>
              <button
                className="btn btn-primary"
                onClick={openAddComboModal}
                style={{ width: '40px', height: '40px', borderRadius: '50%', padding: 0, flexShrink: 0 }}
                title="Add New Combo Offer"
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              </button>
            </div>

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Amount</th>
                    <th>Image</th>
                    <th>Created Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {comboOffersLoading ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>Loading combo offers...</td></tr>
                  ) : comboOffers.length === 0 ? (
                    <tr><td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No combo offers found.</td></tr>
                  ) : (
                    currentComboOffers.map((offer) => (
                      <tr key={offer.combo_offer_id}>
                        <td data-label="ID">{offer.combo_offer_id}</td>
                        <td data-label="Name">{offer.combo_offer_name}</td>
                        <td data-label="Amount">₹{offer.combo_offer_amount}</td>
                        <td data-label="Image">{offer.combo_offer_image ? offer.combo_offer_image : 'No Image'}</td>
                        <td data-label="Created Date">{offer.created_date ? new Date(offer.created_date).toLocaleString('en-GB') : 'N/A'}</td>
                        <td data-label="Actions" style={{ display: 'flex', gap: '8px' }}>
                          <button
                            className="btn btn-primary btn-sm"
                            onClick={() => openAddComboModal(offer)}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', padding: 0, borderRadius: '50%' }}
                            title="Edit Combo Offer"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>
                          </button>
                          <button
                            className="btn btn-danger btn-sm"
                            onClick={() => handleDelete(offer.combo_offer_id, 'comboOffer')}
                            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '32px', height: '32px', padding: 0, borderRadius: '50%', backgroundColor: '#ef4444', color: 'white', border: 'none', cursor: 'pointer' }}
                            title="Delete Combo Offer"
                          >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {totalComboPages > 1 && (
              <div className="pagination-container" style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px', marginTop: '24px' }}>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setComboCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={comboCurrentPage === 1}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"></polyline></svg>
                </button>
                <span className="text-secondary" style={{ fontSize: '14px', fontWeight: '500' }}>
                  Page {comboCurrentPage} of {totalComboPages}
                </span>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={() => setComboCurrentPage(prev => Math.min(prev + 1, totalComboPages))}
                  disabled={comboCurrentPage === totalComboPages}
                  style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', padding: 0 }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Menu Form Modal */}
      {isMenuModalOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsMenuModalOpen(false)}></div>
          <div className="modal-container animate-fade-in">
            <div className="modal-header">
              <h3>{editingMenuId ? 'Edit Menu' : 'Create Menu'}</h3>
              <button className="btn-close" onClick={() => setIsMenuModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Menu Name</label>
                <input
                  type="text"
                  value={menuName}
                  onChange={(e) => setMenuName(e.target.value)}
                  placeholder="Enter menu name..."
                  className="form-input"
                  autoFocus
                />
              </div>

              {editingMenuId && (
                <div className="form-group" style={{ marginTop: '16px' }}>
                  <label>Status</label>
                  <select
                    className="form-input"
                    value={menuStatus}
                    onChange={(e) => setMenuStatus(e.target.value)}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsMenuModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveMenu}>
                {editingMenuId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Content Form Modal */}
      {isContentModalOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setIsContentModalOpen(false)}></div>
          <div className="modal-container animate-fade-in" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3>{editingContentId ? 'Edit Content' : 'Create Content'}</h3>
              <button className="btn-close" onClick={() => setIsContentModalOpen(false)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Menu Name <span style={{ color: '#ef4444' }}>*</span></label>
                <CustomSelect
                  value={contentForm.menu_id}
                  placeholder="Select a Menu"
                  options={menus.filter(m => m.status === 'Active').map(menu => ({
                    value: menu.menu_id,
                    label: menu.menu_name
                  }))}
                  onChange={(val) => {
                    const selectedMenu = menus.find(m => m.menu_id.toString() === val.toString());
                    setContentForm({
                      ...contentForm,
                      menu_id: val,
                      menu_name: selectedMenu ? selectedMenu.menu_name : ''
                    });
                  }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Menu Name (Tamil) <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="text"
                  value={contentForm.menu_name_tamil}
                  onChange={(e) => setContentForm({ ...contentForm, menu_name_tamil: e.target.value })}
                  placeholder="Enter menu name in Tamil..."
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Amount <span style={{ color: '#ef4444' }}>*</span></label>
                <input
                  type="number"
                  value={contentForm.amount}
                  onChange={(e) => setContentForm({ ...contentForm, amount: e.target.value })}
                  placeholder="Enter amount..."
                  className="form-input"
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Upload Image</label>
                {contentForm.existingImage && !contentForm.imageFile && (
                  <div style={{ marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                    Current image: <strong>{contentForm.existingImage}</strong>
                  </div>
                )}
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="form-input"
                  style={{ padding: '8px' }}
                />
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Benefits Text (English) <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  value={contentForm.content_text_english}
                  onChange={(e) => setContentForm({ ...contentForm, content_text_english: e.target.value })}
                  placeholder="Enter content in English..."
                  className="form-input"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Benefits Text (Tamil) <span style={{ color: '#ef4444' }}>*</span></label>
                <textarea
                  value={contentForm.content_text_tamil}
                  onChange={(e) => setContentForm({ ...contentForm, content_text_tamil: e.target.value })}
                  placeholder="Enter content in Tamil..."
                  className="form-input"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Ingredients (English)</label>
                <textarea
                  value={contentForm.ingredients_text_english}
                  onChange={(e) => setContentForm({ ...contentForm, ingredients_text_english: e.target.value })}
                  placeholder="Enter ingredients in English..."
                  className="form-input"
                  rows="3"
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '16px' }}>
                <label>Ingredients (Tamil)</label>
                <textarea
                  value={contentForm.ingredients_text_tamil}
                  onChange={(e) => setContentForm({ ...contentForm, ingredients_text_tamil: e.target.value })}
                  placeholder="Enter ingredients in Tamil..."
                  className="form-input"
                  rows="3"
                ></textarea>
              </div>

              <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Net Weight</label>
                  <input
                    type="text"
                    value={contentForm.net_weight}
                    onChange={(e) => setContentForm({ ...contentForm, net_weight: e.target.value })}
                    placeholder="e.g. 500g"
                    className="form-input"
                  />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Shelf Life</label>
                  <input
                    type="text"
                    value={contentForm.shelf_life}
                    onChange={(e) => setContentForm({ ...contentForm, shelf_life: e.target.value })}
                    placeholder="e.g. 6 Months"
                    className="form-input"
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setIsContentModalOpen(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSaveContent}>
                {editingContentId ? 'Update' : 'Save'}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Combo Offer Modal */}
      {isComboModalOpen && (
        <>
          <div className="modal-backdrop" onClick={closeComboModal}></div>
          <div className="modal-container animate-fade-in" style={{ maxWidth: '500px' }}>
            <div className="modal-header">
              <h3>{editingComboId ? 'Edit Combo Offer' : 'Add New Combo Offer'}</h3>
              <button className="btn-close" onClick={closeComboModal}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            <div className="modal-body">
              <form id="comboForm" onSubmit={handleComboSubmit}>
                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    value={comboForm.name}
                    onChange={e => setComboForm({ ...comboForm, name: e.target.value })}
                    placeholder="Enter Combo Offer Name..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Amount (₹) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number"
                    className="form-input"
                    value={comboForm.amount}
                    onChange={e => setComboForm({ ...comboForm, amount: e.target.value })}
                    placeholder="Enter Amount..."
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '16px' }}>
                  <label>Upload Image</label>
                  {comboForm.existingImage && !comboForm.imageFile && (
                    <div style={{ marginBottom: '8px', fontSize: '13px', color: '#64748b' }}>
                      Current image: <strong>{comboForm.existingImage}</strong>
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleComboImageUpload}
                    className="form-input"
                    style={{ padding: '8px' }}
                  />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={closeComboModal}>Cancel</button>
              <button type="submit" form="comboForm" className="btn btn-primary">{editingComboId ? 'Update' : 'Save'}</button>
            </div>
          </div>
        </>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmModal.isOpen && (
        <>
          <div className="modal-backdrop" onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })}></div>
          <div className="modal-container animate-fade-in" style={{ maxWidth: '400px', textAlign: 'center' }}>
            <div className="modal-body" style={{ padding: '32px 24px 24px' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', backgroundColor: '#fee2e2', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
              </div>
              <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#1e293b', marginBottom: '8px' }}>
                {deleteConfirmModal.type === 'comboOffer' ? 'Delete Combo Offer?' : 
                 deleteConfirmModal.type === 'menu' ? 'Delete Menu?' : 'Delete Content?'}
              </h3>
              <p style={{ color: '#64748b', fontSize: '15px', marginBottom: '24px' }}>
                Are you sure you want to delete this item? This action cannot be undone.
              </p>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  className="btn btn-secondary" 
                  style={{ flex: 1, padding: '12px', fontSize: '15px', fontWeight: '600' }}
                  onClick={() => setDeleteConfirmModal({ isOpen: false, id: null, type: null })}
                >
                  Cancel
                </button>
                <button 
                  className="btn btn-danger" 
                  style={{ flex: 1, padding: '12px', fontSize: '15px', fontWeight: '600', backgroundColor: '#ef4444', color: 'white', border: 'none' }}
                  onClick={confirmDelete}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      <div className="admin-footer">
        <b style={{ color: 'black' }}>&copy; {new Date().getFullYear()} VALAM Foods Admin Portal. All rights reserved.</b>
      </div>
    </div>
  );
}
