import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Platform, Pressable, TextInput, Modal } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Image } from 'expo-image';
import { 
  Search, Plus, Minus, ShoppingCart, Filter, ArrowRight, 
  ChevronLeft, Banknote, Building2, CreditCard, Check,
  Calendar, X, ChevronDown
} from 'lucide-react-native';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { format } from 'date-fns';

import { Brand, Fonts } from '@/constants/theme';
import { useAppStore } from '@/store/app-store';

type Step = 'selection' | 'checkout' | 'success';
type PaymentMethod = 'Cash' | 'Transfer' | 'POS';

// --- ADMIN SALE SCREEN ---
function AdminSaleScreen() {
  const insets = useSafeAreaInsets();
  const { dashboardData } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [timeFilter, setTimeFilter] = useState('All');
  const [isFilterModalVisible, setFilterModalVisible] = useState(false);

  // Filter Modal State
  const [paymentFilter, setPaymentFilter] = useState('All');
  const [attendantFilter, setAttendantFilter] = useState('All staff');

  // Date Range State
  const [fromDate, setFromDate] = useState(new Date('2026-07-01'));
  const [toDate, setToDate] = useState(new Date('2026-07-06'));
  const [showDatePicker, setShowDatePicker] = useState<'from' | 'to' | null>(null);

  const onDateChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    const currentDate = selectedDate || (showDatePicker === 'from' ? fromDate : toDate);
    if (Platform.OS === 'android') {
      setShowDatePicker(null);
    }
    if (showDatePicker === 'from') {
      setFromDate(currentDate);
    } else if (showDatePicker === 'to') {
      setToDate(currentDate);
    }
  };

  const timeFilters = ['All', 'Today', 'This week', 'This month'];

  // Extend recent sales for UI display matching the mockup
  const extendedSales = [
    ...dashboardData.recentSales,
    ...dashboardData.recentSales,
  ].map((sale, idx) => ({ ...sale, uniqueId: `${sale.id}-${idx}` }));

  const getPaymentStyles = (type: string) => {
    switch (type) {
      case 'Cash':
        return { text: '#22C55E', bg: '#ECFDF5', icon: Banknote };
      case 'Transfer':
        return { text: '#3B82F6', bg: '#EFF6FF', icon: Building2 };
      case 'POS':
        return { text: '#9333EA', bg: '#FAF5FF', icon: CreditCard };
      default:
        return { text: '#64748B', bg: '#F1F5F9', icon: Banknote };
    }
  };

  const getAvatarInfo = (type: string, id: string) => {
    // Dummy logic matching mockup
    if (type === 'POS' || id.includes('1044')) {
      return { initials: 'BN', bg: '#F3E8FF', text: '#9333EA' }; // Purple for BN
    }
    return { initials: 'AO', bg: '#DCFCE7', text: '#22C55E' }; // Green for AO
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24, paddingBottom: 16 }]}>
        <View style={styles.adminHeaderRow}>
          <Pressable style={styles.backButton}>
            <ChevronLeft size={24} color="#0F172A" />
          </Pressable>
          <Text style={styles.headerTitle}>All Sales</Text>
        </View>
      </View>

      {/* Search & Filter */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#9CA3AF" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by SRD, products..."
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton} onPress={() => setFilterModalVisible(true)}>
          <Filter size={20} color="#6B7280" />
        </Pressable>
      </View>

      {/* Time Filters */}
      <View style={styles.timeFiltersWrapper}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.timeFiltersScroll}>
          {timeFilters.map(filter => (
            <Pressable 
              key={filter} 
              style={[styles.timeFilterBtn, timeFilter === filter && styles.timeFilterBtnActive]}
              onPress={() => setTimeFilter(filter)}
            >
              <Text style={[styles.timeFilterText, timeFilter === filter && styles.timeFilterTextActive]}>
                {filter}
              </Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      {/* Summary Row */}
      <View style={styles.adminSummaryRow}>
        <View style={styles.adminSummaryCol}>
          <Text style={[styles.adminSummaryLabel, { color: '#22C55E' }]}>Cash</Text>
          <Text style={[styles.adminSummaryValue, { color: '#22C55E' }]}>₦16,050</Text>
        </View>
        <View style={styles.adminSummaryCol}>
          <Text style={[styles.adminSummaryLabel, { color: '#3B82F6' }]}>Transfer</Text>
          <Text style={[styles.adminSummaryValue, { color: '#3B82F6' }]}>₦35,150</Text>
        </View>
        <View style={styles.adminSummaryCol}>
          <Text style={[styles.adminSummaryLabel, { color: '#9333EA' }]}>POS</Text>
          <Text style={[styles.adminSummaryValue, { color: '#9333EA' }]}>₦18,150</Text>
        </View>
      </View>

      {/* Sales List */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.adminContent, { paddingBottom: insets.bottom + 20 }]}>
        <View style={styles.adminListCard}>
          {extendedSales.map((sale, idx) => {
            const isLast = idx === extendedSales.length - 1;
            const PaymentIcon = getPaymentStyles(sale.type).icon;
            const paymentStyles = getPaymentStyles(sale.type);
            const avatarInfo = getAvatarInfo(sale.type, sale.transactionId);

            return (
              <View key={sale.uniqueId} style={[styles.adminSaleItem, isLast && styles.noBorderBottom]}>
                <View style={[styles.adminAvatar, { backgroundColor: avatarInfo.bg }]}>
                  <Text style={[styles.adminAvatarText, { color: avatarInfo.text }]}>{avatarInfo.initials}</Text>
                </View>
                
                <View style={styles.adminSaleInfo}>
                  <View style={styles.adminSaleTopRow}>
                    <Text style={styles.adminTransactionId}>{sale.transactionId}</Text>
                    <View style={[styles.adminPaymentPill, { backgroundColor: paymentStyles.bg }]}>
                      <PaymentIcon size={12} color={paymentStyles.text} />
                      <Text style={[styles.adminPaymentPillText, { color: paymentStyles.text }]}>{sale.type}</Text>
                    </View>
                  </View>
                  <View style={styles.adminSaleBottomRow}>
                    <Text style={styles.adminSaleItems} numberOfLines={1}>
                      {sale.items.map(i => `${i.name} ${i.quantity}`).join(', ')}
                    </Text>
                    <View style={styles.adminMorePill}>
                      <Text style={styles.adminMoreText}>+{sale.additionalItemsCount} more</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.adminSaleAmounts}>
                  <Text style={styles.adminSalePrice}>₦{sale.amount.toLocaleString()}</Text>
                  <Text style={styles.adminSaleTime}>{sale.time}</Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        visible={isFilterModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { paddingBottom: Math.max(insets.bottom, 24) }]}>
            {/* Handle */}
            <View style={styles.modalHandleWrapper}>
              <View style={styles.modalHandle} />
            </View>

            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filters</Text>
              <Pressable style={styles.modalCloseBtn} onPress={() => setFilterModalVisible(false)}>
                <X size={20} color="#64748B" />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Date Range */}
              <Text style={styles.modalSectionTitle}>Custom Date Range</Text>
              <View style={styles.dateRangeRow}>
                <View style={styles.dateInputCol}>
                  <Text style={styles.dateInputLabel}>From</Text>
                  <Pressable style={styles.dateInputBox} onPress={() => setShowDatePicker('from')}>
                    <Calendar size={18} color="#64748B" />
                    <Text style={styles.dateInputText}>{format(fromDate, 'dd/MM/yyyy')}</Text>
                    <ChevronDown size={18} color="#64748B" />
                  </Pressable>
                </View>
                <View style={styles.dateInputCol}>
                  <Text style={styles.dateInputLabel}>To</Text>
                  <Pressable style={styles.dateInputBox} onPress={() => setShowDatePicker('to')}>
                    <Calendar size={18} color="#64748B" />
                    <Text style={styles.dateInputText}>{format(toDate, 'dd/MM/yyyy')}</Text>
                    <ChevronDown size={18} color="#64748B" />
                  </Pressable>
                </View>
              </View>

              {showDatePicker && (
                <View style={Platform.OS === 'ios' ? styles.iosDatePickerWrapper : undefined}>
                  <DateTimePicker
                    value={showDatePicker === 'from' ? fromDate : toDate}
                    mode="date"
                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                    onChange={onDateChange}
                  />
                  {Platform.OS === 'ios' && (
                    <Pressable 
                      style={styles.iosDatePickerConfirm}
                      onPress={() => setShowDatePicker(null)}
                    >
                      <Text style={styles.iosDatePickerConfirmText}>Confirm Date</Text>
                    </Pressable>
                  )}
                </View>
              )}

              {/* Payment Method */}
              <Text style={styles.modalSectionTitle}>Payment Method</Text>
              <View style={styles.modalPillRow}>
                {['All', 'Cash', 'Transfer', 'POS'].map(method => {
                  const isActive = paymentFilter === method;
                  let Icon = undefined;
                  if (method === 'Cash') Icon = Banknote;
                  if (method === 'Transfer') Icon = Building2;
                  if (method === 'POS') Icon = CreditCard;

                  return (
                    <Pressable 
                      key={method}
                      style={[styles.modalPill, isActive && styles.modalPillActive]}
                      onPress={() => setPaymentFilter(method)}
                    >
                      {Icon && <Icon size={14} color={isActive ? '#385F24' : '#64748B'} style={{ marginRight: 6 }} />}
                      <Text style={[styles.modalPillText, isActive && styles.modalPillTextActive]}>{method}</Text>
                    </Pressable>
                  );
                })}
              </View>

              {/* Attendant */}
              <Text style={styles.modalSectionTitle}>Attendant</Text>
              <View style={styles.modalPillRow}>
                {['All staff', 'Adaeze', 'Babajide', 'Pamella'].map(staff => {
                  const isActive = attendantFilter === staff;
                  return (
                    <Pressable 
                      key={staff}
                      style={[styles.modalPill, isActive && styles.modalPillActive]}
                      onPress={() => setAttendantFilter(staff)}
                    >
                      <Text style={[styles.modalPillText, isActive && styles.modalPillTextActive]}>{staff}</Text>
                    </Pressable>
                  );
                })}
              </View>
            </ScrollView>

            {/* Actions */}
            <View style={styles.modalActionsRow}>
              <Pressable style={styles.modalActionReset} onPress={() => {
                setTimeFilter('All');
                setPaymentFilter('All');
                setAttendantFilter('All staff');
                setFromDate(new Date('2026-07-01'));
                setToDate(new Date('2026-07-06'));
              }}>
                <Text style={styles.modalActionResetText}>Reset all</Text>
              </Pressable>
              <Pressable style={styles.modalActionApply} onPress={() => setFilterModalVisible(false)}>
                <Text style={styles.modalActionApplyText}>Apply Filter</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- ATTENDANCE SALE SCREEN ---
function AttendanceSaleScreen() {
  const insets = useSafeAreaInsets();
  const [step, setStep] = useState<Step>('selection');
  const [searchQuery, setSearchQuery] = useState('');
  const [cart, setCart] = useState<{[key: string]: number}>({});
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Cash');
  const [amountReceived, setAmountReceived] = useState<string>('');

  const products = [
    { 
      id: '1', 
      name: 'Golden Penny Semovita 1kg', 
      price: 1600, 
      unit: 'bag', 
      stock: 12, 
      stockText: '12 in stock',
      stockColor: '#10B981',
      image: require('@/assets/images/indomie.png') 
    },
    { 
      id: '2', 
      name: 'Milo 380g', 
      price: 1200, 
      unit: 'tin', 
      stock: 5, 
      stockText: '5 left',
      stockColor: '#F59E0B',
      image: require('@/assets/images/indomie.png') 
    },
    { 
      id: '3', 
      name: 'Coca-Cola 50cl', 
      price: 1600, 
      unit: 'crate', 
      stock: 24, 
      stockText: '24 in stock',
      stockColor: '#10B981',
      image: require('@/assets/images/coke.png')
    },
    { 
      id: '4', 
      name: 'Peak Milk Tin', 
      price: 1230, 
      unit: 'tin', 
      stock: 12, 
      stockText: '12 tins',
      stockColor: '#10B981',
      image: require('@/assets/images/indomie.png') 
    },
    { 
      id: '5', 
      name: 'Fanta 33cl', 
      price: 0, 
      unit: '', 
      stock: 0, 
      stockText: 'Out of stock',
      stockColor: '#9CA3AF',
      image: require('@/assets/images/coke.png')
    },
  ];

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addToCart = (id: string) => {
    setCart(prev => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => {
      const newCart = { ...prev };
      if (newCart[id] > 1) {
        newCart[id]--;
      } else if (newCart[id] === 1) {
        delete newCart[id];
      }
      return newCart;
    });
  };

  const cartItemCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = products.reduce((total, p) => total + (cart[p.id] || 0) * p.price, 0);

  const quickAmounts = [500, 1000, 2000, 5000, 10000, 20000];

  const handleCompleteSale = () => {
    setStep('success');
  };

  const handleStartNewSale = () => {
    setCart({});
    setAmountReceived('');
    setPaymentMethod('Cash');
    setStep('selection');
  };

  const renderSelectionStep = () => (
    <View style={styles.flex1}>
      <View style={[styles.header, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
        <Text style={styles.headerTitle}>New Sale</Text>
        <View style={styles.cartPill}>
          <ShoppingCart size={14} color="#FFFFFF" />
          <Text style={styles.cartPillText}>{cartItemCount} items</Text>
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <Search size={20} color="#6B7280" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search products"
            placeholderTextColor="#9CA3AF"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        <Pressable style={styles.filterButton}>
          <Filter size={20} color="#6B7280" />
        </Pressable>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.content, { paddingBottom: cartItemCount > 0 ? 120 : 20 }]} 
      >
        <View style={styles.productList}>
          {filteredProducts.map(product => {
            const quantity = cart[product.id] || 0;
            const isOutOfStock = product.stock === 0;

            return (
              <View key={product.id} style={[styles.productCard, isOutOfStock && styles.productCardDisabled]}>
                <View style={styles.imageContainer}>
                  <Image source={product.image} style={styles.productImage} contentFit="contain" />
                </View>
                
                <View style={styles.productInfo}>
                  <Text style={[styles.productName, isOutOfStock && styles.textDisabled]}>
                    {product.name}
                  </Text>
                  <View style={styles.priceStockRow}>
                    {!isOutOfStock ? (
                      <>
                        <Text style={styles.productPrice}>₦{product.price.toLocaleString()}</Text>
                        <Text style={styles.productUnit}> / {product.unit}</Text>
                      </>
                    ) : (
                      <Text style={[styles.productPrice, styles.textDisabled]}>{product.stockText}</Text>
                    )}

                    {!isOutOfStock && (
                      <View style={styles.stockBadge}>
                        <View style={[styles.stockDot, { backgroundColor: product.stockColor }]} />
                        <Text style={[styles.stockText, { color: product.stockColor }]}>
                          {product.stockText}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {isOutOfStock ? (
                  <View style={styles.naBadge}>
                    <Text style={styles.naText}>N/A</Text>
                  </View>
                ) : (
                  <View style={styles.quantityControl}>
                    <Pressable style={styles.qtyBtnMinus} onPress={() => removeFromCart(product.id)}>
                      <Minus size={16} color="#1F2937" />
                    </Pressable>
                    <Text style={styles.qtyText}>{quantity}</Text>
                    <Pressable style={styles.qtyBtnPlus} onPress={() => addToCart(product.id)}>
                      <Plus size={16} color="#38662B" />
                    </Pressable>
                  </View>
                )}
              </View>
            );
          })}
        </View>
      </ScrollView>

      {cartItemCount > 0 && (
        <View style={[styles.bottomBarWrapper, { bottom: insets.bottom + 16 }]}>
          <Pressable style={styles.bottomBar} onPress={() => setStep('checkout')}>
            <View style={styles.bottomBarLeft}>
              <View style={styles.circleBadge}>
                <Text style={styles.circleBadgeText}>{cartItemCount}</Text>
              </View>
              <View>
                <Text style={styles.bottomBarTitle}>{cartItemCount} items in cart</Text>
                <Text style={styles.bottomBarSubtitle}>Tap to review & pay</Text>
              </View>
            </View>
            <View style={styles.bottomBarRight}>
              <Text style={styles.bottomBarPrice}>₦{cartTotal.toLocaleString()}</Text>
              <View style={styles.arrowCircle}>
                <ArrowRight size={18} color="#FFFFFF" />
              </View>
            </View>
          </Pressable>
        </View>
      )}
    </View>
  );

  const renderCheckoutStep = () => {
    const received = parseInt(amountReceived.replace(/,/g, ''), 10) || 0;
    const changeToGive = received > cartTotal ? received - cartTotal : 0;

    return (
      <View style={styles.flex1}>
        <View style={[styles.checkoutHeader, { paddingTop: Platform.OS === 'ios' ? insets.top + 8 : 24 }]}>
          <Pressable style={styles.backButton} onPress={() => setStep('selection')}>
            <ChevronLeft size={24} color="#1E293B" />
          </Pressable>
          <Text style={styles.checkoutHeaderTitle}>New Sales</Text>
          <View style={styles.cartPill}>
            <ShoppingCart size={14} color="#FFFFFF" />
            <Text style={styles.cartPillText}>{cartItemCount} items</Text>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.checkoutContent, { paddingBottom: 100 }]}>
          <View style={styles.checkoutCard}>
            {products.filter(p => cart[p.id]).map((product, idx, arr) => (
              <View key={product.id} style={[styles.checkoutItemRow, idx === arr.length - 1 && styles.noBorderBottom]}>
                <View style={styles.checkoutItemInfo}>
                  <Text style={styles.checkoutItemName}>{product.name}</Text>
                  <Text style={styles.checkoutItemDetails}>x{cart[product.id]} @ ₦{product.price.toLocaleString()}</Text>
                </View>
                <Text style={styles.checkoutItemPrice}>₦{(cart[product.id] * product.price).toLocaleString()}</Text>
              </View>
            ))}
          </View>

          <View style={styles.checkoutCard}>
            <View style={[styles.checkoutItemRow, { paddingVertical: 12 }]}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₦{cartTotal.toLocaleString()}</Text>
            </View>
            <View style={[styles.checkoutItemRow, styles.noBorderBottom, { paddingVertical: 12 }]}>
              <Text style={styles.summaryLabelBold}>Total</Text>
              <Text style={styles.summaryValueGreen}>₦{cartTotal.toLocaleString()}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Payment Method</Text>
          <View style={styles.paymentMethodsRow}>
            <Pressable 
              style={[styles.paymentMethodBtn, paymentMethod === 'Cash' && styles.paymentMethodActive]}
              onPress={() => setPaymentMethod('Cash')}
            >
              <Banknote size={16} color={paymentMethod === 'Cash' ? '#22C55E' : '#9CA3AF'} />
              <Text style={[styles.paymentMethodText, paymentMethod === 'Cash' && styles.paymentMethodTextActive]}>Cash</Text>
            </Pressable>
            <Pressable 
              style={[styles.paymentMethodBtn, paymentMethod === 'Transfer' && styles.paymentMethodActive]}
              onPress={() => setPaymentMethod('Transfer')}
            >
              <Building2 size={16} color={paymentMethod === 'Transfer' ? '#22C55E' : '#9CA3AF'} />
              <Text style={[styles.paymentMethodText, paymentMethod === 'Transfer' && styles.paymentMethodTextActive]}>Transfer</Text>
            </Pressable>
            <Pressable 
              style={[styles.paymentMethodBtn, paymentMethod === 'POS' && styles.paymentMethodActive]}
              onPress={() => setPaymentMethod('POS')}
            >
              <CreditCard size={16} color={paymentMethod === 'POS' ? '#22C55E' : '#9CA3AF'} />
              <Text style={[styles.paymentMethodText, paymentMethod === 'POS' && styles.paymentMethodTextActive]}>POS</Text>
            </Pressable>
          </View>

          <Text style={styles.sectionTitle}>Amount Received</Text>
          <View style={styles.inputContainer}>
            <Text style={styles.currencyPrefix}>₦</Text>
            <TextInput 
              style={styles.amountInput}
              keyboardType="numeric"
              value={amountReceived}
              onChangeText={setAmountReceived}
              placeholder="0"
            />
          </View>

          <View style={styles.quickAmountGrid}>
            {quickAmounts.map((amt) => (
              <Pressable 
                key={amt} 
                style={styles.quickAmountBtn}
                onPress={() => setAmountReceived(amt.toLocaleString())}
              >
                <Text style={styles.quickAmountText}>₦{amt.toLocaleString()}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.sectionTitle}>Change to Give</Text>
          <View style={styles.changeContainer}>
            <Text style={styles.changeText}>₦{changeToGive.toLocaleString()}</Text>
          </View>
        </ScrollView>

        <View style={[styles.checkoutBottomBar, { paddingBottom: Math.max(insets.bottom, 16) }]}>
          <Pressable style={styles.completeBtn} onPress={handleCompleteSale}>
            <Text style={styles.completeBtnText}>Complete Sale & Log</Text>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderSuccessStep = () => (
    <View style={[styles.flex1, { backgroundColor: '#FFFFFF', paddingTop: insets.top + 60, paddingHorizontal: 20 }]}>
      <View style={styles.successIconContainer}>
        <View style={styles.successIconCircle}>
          <View style={styles.successIconInner}>
            <Check size={36} color="#FFFFFF" />
          </View>
        </View>
      </View>

      <Text style={styles.successTitle}>Sale Logged</Text>
      <Text style={styles.successSubtitle}>Transaction recorded successfully</Text>

      <View style={styles.receiptCard}>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Transaction ID</Text>
          <Text style={styles.receiptValue}>SRD-1043</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Date & Time</Text>
          <Text style={styles.receiptValue}>Jun 7, 2026 - 9:41am</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Logged by</Text>
          <Text style={styles.receiptValue}>Adaeze Okafor</Text>
        </View>
        <View style={styles.receiptRow}>
          <Text style={styles.receiptLabel}>Payment method</Text>
          <View style={styles.paymentPill}>
            <Text style={styles.paymentPillText}>{paymentMethod}</Text>
          </View>
        </View>
        <View style={[styles.receiptRow, styles.noBorderBottom, { paddingTop: 16, marginTop: 4 }]}>
          <Text style={styles.receiptTotalLabel}>Total</Text>
          <Text style={styles.receiptTotalValue}>₦{cartTotal.toLocaleString()}</Text>
        </View>
      </View>

      <View style={styles.successActions}>
        <Pressable style={styles.successBtnPrimary} onPress={handleStartNewSale}>
          <Plus size={20} color="#FFFFFF" />
          <Text style={styles.successBtnPrimaryText}>Start New Sale</Text>
        </Pressable>
        <Pressable style={styles.successBtnOutline}>
          <Plus size={20} color="#38662B" />
          <Text style={styles.successBtnOutlineText}>View All Sale</Text>
        </Pressable>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {step === 'selection' && renderSelectionStep()}
      {step === 'checkout' && renderCheckoutStep()}
      {step === 'success' && renderSuccessStep()}
    </View>
  );
}

// --- MAIN EXPORT ---
export default function SaleContainer() {
  const { role } = useAppStore();
  if (role === 'admin') {
    return <AdminSaleScreen />;
  }
  return <AttendanceSaleScreen />;
}

// --- STYLES ---
const styles = StyleSheet.create({
  flex1: { flex: 1 },
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    backgroundColor: '#FFFFFF',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  cartPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#618A49',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    gap: 6,
  },
  cartPillText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    gap: 12,
  },
  searchBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: 12,
    height: 48,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    fontFamily: Fonts?.sans,
    color: '#1F2937',
  },
  filterButton: {
    width: 48,
    height: 48,
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 8,
  },
  productList: {
    gap: 12,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
  },
  productCardDisabled: {
    opacity: 0.5,
  },
  imageContainer: {
    width: 44,
    height: 44,
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    height: '100%',
  },
  productInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  textDisabled: {
    color: '#9CA3AF',
  },
  priceStockRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productPrice: {
    fontSize: 13,
    fontWeight: '700',
    color: '#334155',
    fontFamily: Fonts?.sans,
  },
  productUnit: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  stockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
    gap: 4,
  },
  stockDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  stockText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  quantityControl: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginLeft: 8,
  },
  qtyBtnMinus: {
    width: 28,
    height: 28,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  qtyBtnPlus: {
    width: 28,
    height: 28,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#DCFCE7',
  },
  qtyText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    minWidth: 12,
    textAlign: 'center',
  },
  naBadge: {
    backgroundColor: '#E2E8F0',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginLeft: 8,
  },
  naText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  bottomBarWrapper: {
    position: 'absolute',
    left: 20,
    right: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#385F24',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  bottomBarLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  circleBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  circleBadgeText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Fonts?.sans,
  },
  bottomBarTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: Fonts?.sans,
    marginBottom: 2,
  },
  bottomBarSubtitle: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: Fonts?.sans,
  },
  bottomBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bottomBarPrice: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    fontFamily: Fonts?.sans,
  },
  arrowCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkoutHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    marginRight: 16,
  },
  checkoutHeaderTitle: {
    flex: 1,
    fontSize: 22,
    fontWeight: '600',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  checkoutContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
  },
  checkoutCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  checkoutItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  noBorderBottom: {
    borderBottomWidth: 0,
  },
  checkoutItemInfo: {
    flex: 1,
  },
  checkoutItemName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  checkoutItemDetails: {
    fontSize: 14,
    color: '#94A3B8',
    fontFamily: Fonts?.sans,
  },
  checkoutItemPrice: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  summaryLabel: {
    fontSize: 15,
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  summaryValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  summaryLabelBold: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  summaryValueGreen: {
    fontSize: 18,
    fontWeight: '700',
    color: '#385F24',
    fontFamily: Fonts?.sans,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginTop: 8,
    marginBottom: 12,
  },
  paymentMethodsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  paymentMethodBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    backgroundColor: '#F1F5F9',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  paymentMethodActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#86EFAC',
  },
  paymentMethodText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  paymentMethodTextActive: {
    color: '#22C55E',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 52,
    marginBottom: 16,
    backgroundColor: '#FFFFFF',
  },
  currencyPrefix: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
    fontSize: 16,
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  quickAmountGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  quickAmountBtn: {
    width: '31%',
    backgroundColor: '#F8FAFC',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  quickAmountText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  changeContainer: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 16,
    height: 52,
    justifyContent: 'center',
    marginBottom: 24,
    backgroundColor: '#FFFFFF',
  },
  changeText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#22C55E',
    fontFamily: Fonts?.sans,
  },
  checkoutBottomBar: {
    paddingHorizontal: 20,
    paddingTop: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  completeBtn: {
    backgroundColor: '#385F24',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  completeBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  successIconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  successIconCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: '#ECFDF5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successIconInner: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#22C55E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#475569',
    textAlign: 'center',
    fontFamily: Fonts?.sans,
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    fontFamily: Fonts?.sans,
    marginBottom: 32,
  },
  receiptCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 20,
    marginBottom: 32,
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  receiptLabel: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  receiptValue: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  paymentPill: {
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  paymentPillText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#22C55E',
    fontFamily: Fonts?.sans,
  },
  receiptTotalLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  receiptTotalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: '#385F24',
    fontFamily: Fonts?.sans,
  },
  successActions: {
    gap: 16,
  },
  successBtnPrimary: {
    flexDirection: 'row',
    backgroundColor: '#385F24',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successBtnPrimaryText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  successBtnOutline: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#385F24',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  successBtnOutlineText: {
    color: '#385F24',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },

  // --- Admin Specific Styles ---
  adminHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  timeFiltersWrapper: {
    marginBottom: 16,
  },
  timeFiltersScroll: {
    paddingHorizontal: 20,
    gap: 8,
  },
  timeFilterBtn: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timeFilterBtnActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#E2E8F0',
  },
  timeFilterText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  timeFilterTextActive: {
    color: '#385F24',
  },
  adminSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingHorizontal: 20,
    gap: 24,
    marginBottom: 16,
  },
  adminSummaryCol: {
    alignItems: 'flex-end',
    gap: 4,
  },
  adminSummaryLabel: {
    fontSize: 14,
    fontWeight: '500',
    fontFamily: Fonts?.sans,
  },
  adminSummaryValue: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: Fonts?.sans,
  },
  adminContent: {
    paddingHorizontal: 20,
  },
  adminListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    paddingHorizontal: 16,
  },
  adminSaleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  adminAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  adminAvatarText: {
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  adminSaleInfo: {
    flex: 1,
    justifyContent: 'center',
    gap: 4,
  },
  adminSaleTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminTransactionId: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  adminPaymentPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
    gap: 4,
  },
  adminPaymentPillText: {
    fontSize: 11,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  adminSaleBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  adminSaleItems: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: Fonts?.sans,
    flexShrink: 1,
  },
  adminMorePill: {
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  adminMoreText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
  },
  adminSaleAmounts: {
    alignItems: 'flex-end',
    marginLeft: 8,
  },
  adminSalePrice: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginBottom: 4,
  },
  adminSaleTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: Fonts?.sans,
  },

  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingHorizontal: 20,
    maxHeight: '90%',
  },
  modalHandleWrapper: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: '#E2E8F0',
    borderRadius: 2,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: Fonts?.sans,
  },
  modalCloseBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalSectionTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
    fontFamily: Fonts?.sans,
    marginBottom: 12,
  },
  dateRangeRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  dateInputCol: {
    flex: 1,
    gap: 8,
  },
  dateInputLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E293B',
    fontFamily: Fonts?.sans,
  },
  dateInputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    height: 44,
  },
  dateInputText: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    fontFamily: Fonts?.sans,
    marginLeft: 8,
  },
  modalPillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 24,
  },
  modalPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
  },
  modalPillActive: {
    backgroundColor: '#ECFDF5',
    borderColor: '#E2E8F0',
  },
  modalPillText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748B',
    fontFamily: Fonts?.sans,
  },
  modalPillTextActive: {
    color: '#385F24',
  },
  modalActionsRow: {
    flexDirection: 'row',
    gap: 12,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  modalActionReset: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#385F24',
    alignItems: 'center',
  },
  modalActionResetText: {
    color: '#385F24',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  modalActionApply: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 8,
    backgroundColor: '#385F24',
    alignItems: 'center',
  },
  modalActionApplyText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
  iosDatePickerWrapper: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
  },
  iosDatePickerConfirm: {
    backgroundColor: '#385F24',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 12,
  },
  iosDatePickerConfirmText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: Fonts?.sans,
  },
});
