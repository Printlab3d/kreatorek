
import React from 'react';
import { useLanguage } from '../context/LanguageContext'; // Added for translation

// Definicje kształtów i metod produkcji
const shapes = [
  { id: 'circle', nameKey: 'circle', icon: '○' },
  { id: 'square', nameKey: 'square', icon: '□' },
  { id: 'rectangle', nameKey: 'rectangle', icon: '▭' },
  { id: 'hexagon', nameKey: 'hexagon', icon: '⬡' },
  { id: 'octagon', nameKey: 'octagon', icon: '⯃' },
  { id: 'diamond', nameKey: 'diamond', icon: '◆' }
];

const productionMethods = [
  {
    id: '3d',
    nameKey: 'full3DPrint',
    descriptionKey: 'max4Colors',
    icon: '🖨️',
    colors: 4
  },
  {
    id: 'laser',
    nameKey: 'laserResin',
    descriptionKey: 'unlimitedColors',
    icon: '✨',
    colors: 'unlimited',
    premium: true
  },
  {
    id: '3d-resin',
    nameKey: 'print3DResin',
    descriptionKey: 'max4ColorsGlass',
    icon: '💎',
    colors: 4,
    premium: true
  }
];

const colors = [
  { name: 'Niebieski', value: '#3b82f6' }, // Name for title attribute, no nameKey as per outline
  { name: 'Czerwony', value: '#ef4444' },
  { name: 'Zielony', value: '#10b981' },
  { name: 'Żółty', value: '#f59e0b' },
  { name: 'Fioletowy', value: '#8b5cf6' },
  { name: 'Różowy', value: '#ec4899' },
  { name: 'Czarny', value: '#1f2937' },
  { name: 'Biały', value: '#f3f4f6' },
  { name: 'Szary', value: '#6b7280' },
  { name: 'Brązowy', value: '#92400e' },
  { name: 'Pomarańczowy', value: '#f97316' },
  { name: 'Turkusowy', value: '#06b6d4' },
  { name: 'Cyjan', value: '#22d3ee' },
  { name: 'Limonkowy', value: '#84cc16' },
  { name: 'Indygo', value: '#4f46e5' },
  { name: 'Magenta', value: '#d946ef' }
];

const hookPositions = [
  { id: 'top-center', nameKey: 'topCenter', icon: '↑' },
  { id: 'top-left', nameKey: 'topLeft', icon: '↖' },
  { id: 'top-right', nameKey: 'topRight', icon: '↗' },
  { id: 'side-left', nameKey: 'sideLeft', icon: '←' },
  { id: 'side-right', nameKey: 'sideRight', icon: '→' }
];

export default function ControlPanel({ config, onConfigChange, onImageUpload }) {
  const { t } = useLanguage(); // Added for translation
  const [showPaymentModal, setShowPaymentModal] = React.useState(false);
  const [showEmailModal, setShowEmailModal] = React.useState(false);
  const [showContactModal, setShowContactModal] = React.useState(false);

  const calculatePrice = () => {
    const { productionMethod, hasNFC, quantity } = config;

    let basePriceForKeyring = 0; // Price of the keyring itself, without NFC or resin
    let nfcCostPerUnit = 0;
    let resinCostPerUnit = 0;

    // Base price of keyring based on quantity (without NFC)
    if (quantity === 100) basePriceForKeyring = 5;
    else if (quantity === 500) basePriceForKeyring = 4;
    else if (quantity === 1000) basePriceForKeyring = 3;

    // NFC cost per unit (additional cost)
    if (hasNFC) {
      if (quantity === 100) nfcCostPerUnit = 5;
      else if (quantity === 500) nfcCostPerUnit = 4;
      else if (quantity === 1000) nfcCostPerUnit = 3;
    }

    // Resin cost (additional cost for premium methods)
    if (productionMethod === 'laser' || productionMethod === '3d-resin') {
      resinCostPerUnit = 2;
    }

    const totalPerUnit = basePriceForKeyring + nfcCostPerUnit + resinCostPerUnit;
    const totalOrderPrice = totalPerUnit * quantity;

    return {
      perUnit: totalPerUnit,
      total: totalOrderPrice,
      savings: quantity === 1000 ? '50%' : quantity === 500 ? '25%' : '0%',
      // Expose breakdown components
      basePriceForKeyring: basePriceForKeyring,
      nfcCostPerUnit: nfcCostPerUnit,
      resinCostPerUnit: resinCostPerUnit
    };
  };

  // Oblicz różnicę w cenie za NFC w zależności od ilości
  const getNFCPriceDifference = () => {
    const { quantity } = config;
    if (quantity === 100) return 5;
    if (quantity === 500) return 4;
    if (quantity === 1000) return 3;
    return 5; // domyślnie
  };

  const price = calculatePrice();
  const nfcPriceDiff = getNFCPriceDifference();

  // Sprawdź czy NFC jest dostępne
  const effectiveSize = config.shape === 'rectangle'
    ? Math.min(config.width, config.height)
    : config.size;
  const isNFCAvailable = effectiveSize >= 2.5;

  return (
    <>
      <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 space-y-6">
        {/* Shape Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('keychainShape')}
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
            {shapes.map((shape) => (
              <button
                key={shape.id}
                onClick={() => {
                  onConfigChange({ shape: shape.id });
                }}
                className={`p-3 rounded-xl border-2 transition-all ${
                  config.shape === shape.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
                title={t(shape.nameKey)}
              >
                <div className="text-2xl mb-1">{shape.icon}</div>
                <div className="text-[10px] font-medium text-gray-700 truncate">{t(shape.nameKey)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Size Controls */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('size')}
          </label>
          {config.shape === 'rectangle' ? (
            <div className="space-y-3">
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('width')} (cm)</label>
                <input
                  type="range"
                  min="2.5"
                  max="7"
                  step="0.5"
                  value={config.width}
                  onChange={(e) => onConfigChange({ width: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-right text-sm font-medium text-blue-600 mt-1">
                  {config.width} cm
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-600 mb-1">{t('height')} (cm)</label>
                <input
                  type="range"
                  min="2.5"
                  max="7"
                  step="0.5"
                  value={config.height}
                  onChange={(e) => onConfigChange({ height: parseFloat(e.target.value) })}
                  className="w-full"
                />
                <div className="text-right text-sm font-medium text-blue-600 mt-1">
                  {config.height} cm
                </div>
              </div>
            </div>
          ) : (
            <div>
              <input
                type="range"
                min="2.5"
                max="7"
                step="0.5"
                value={config.size}
                onChange={(e) => onConfigChange({ size: parseFloat(e.target.value) })}
                className="w-full"
              />
              <div className="text-left text-sm font-medium text-blue-600 mt-1">
                {config.size} cm
              </div>
            </div>
          )}
        </div>

        {/* Production Method */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('productionMethod')}
          </label>
          <div className="space-y-2">
            {productionMethods.map((method) => (
              <button
                key={method.id}
                onClick={() => onConfigChange({ productionMethod: method.id })}
                className={`w-full p-3 rounded-xl border-2 transition-all text-left ${
                  config.productionMethod === method.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{method.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{t(method.nameKey)}</span>
                      {method.premium && (
                        <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded-full font-semibold">
                          +2 zł
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600">{t(method.descriptionKey)}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('customGraphic')}
          </label>
          <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-blue-400 transition-colors bg-white">
            <input
              type="file"
              accept="image/*"
              onChange={onImageUpload}
              className="hidden"
              id="graphic-upload"
            />
            <label htmlFor="graphic-upload" className="cursor-pointer">
              <svg
                className="w-12 h-12 mx-auto text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <p className="text-sm text-gray-600 mb-1">{t('clickToAdd')}</p>
              <p className="text-xs text-gray-500">{t('pngTransparent')}</p>
            </label>
          </div>

          {config.showGraphic && (
            <div className="mt-4 space-y-4">
              <div>
                <label className="block text-xs text-gray-600 mb-2">
                  {t('graphicSize')}: {config.graphicScale}%
                </label>
                <input
                  type="range"
                  min="40"
                  max="95"
                  step="5"
                  value={config.graphicScale}
                  onChange={(e) => onConfigChange({ graphicScale: parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>{t('small')}</span>
                  <span>{t('medium')}</span>
                  <span>{t('large')}</span>
                </div>
              </div>

              <button
                onClick={() => onConfigChange({ showGraphic: false, graphicUrl: null })}
                className="w-full py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                {t('removeGraphic')}
              </button>
            </div>
          )}
        </div>

        {/* Color Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-2">
            {t('keychainColor')} {config.productionMethod === '3d' && `(${t('max4ColorsShort')})`}
          </label>
          <div className="grid grid-cols-8 gap-1.5 bg-white p-2 rounded-lg">
            {colors.map((color) => (
              <button
                key={color.value}
                onClick={() => onConfigChange({ color: color.value })}
                className={`w-8 h-8 rounded-md border transition-all ${
                  config.color === color.value
                    ? 'border-2 border-blue-600 ring-2 ring-blue-200'
                    : 'border border-gray-200 hover:scale-110'
                }`}
                style={{ backgroundColor: color.value }}
                title={color.name}
              />
            ))}
          </div>
        </div>

        {/* Hook Position */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('hookPosition')}
          </label>
          <div className="grid grid-cols-3 gap-2">
            {hookPositions.map((position) => (
              <button
                key={position.id}
                onClick={() => onConfigChange({ hookPosition: position.id })}
                className={`p-3 rounded-xl border-2 transition-all ${
                  config.hookPosition === position.id
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-3xl mb-1 flex justify-center">{position.icon}</div>
                <div className="text-[10px] font-medium text-gray-700">{t(position.nameKey)}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Border Toggle */}
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
          <label className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                {t('border')}
                <span className="text-[10px] bg-green-100 text-green-800 px-2 py-0.5 rounded-full font-semibold">
                  {t('recommended')} • 0 zł
                </span>
              </span>
              <p className="text-xs text-gray-600 mt-0.5">{t('increasesStrength')}</p>
            </div>
            <button
              onClick={() => onConfigChange({ hasBorder: !config.hasBorder })}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.hasBorder ? 'bg-green-600' : 'bg-gray-300'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.hasBorder ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>

          {config.hasBorder && (
            <div className="grid grid-cols-8 gap-1.5 mt-3">
              {colors.slice(0, 8).map((color) => (
                <button
                  key={color.value}
                  onClick={() => onConfigChange({ borderColor: color.value })}
                  className={`w-8 h-8 rounded-md border transition-all ${
                    config.borderColor === color.value
                      ? 'border-2 border-blue-600 ring-2 ring-blue-200'
                      : 'border border-gray-200 hover:scale-110'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        {/* NFC Option - dynamiczna cena */}
        <div className={`rounded-xl p-4 border-2 transition-all ${!isNFCAvailable ? 'opacity-50' : ''}`}>
          <label className="flex items-center justify-between mb-2">
            <div>
              <span className="text-sm font-semibold text-gray-900 flex items-center gap-2">
                {t('nfcChip')}
                <span className="text-[10px] bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full font-semibold">
                  +{nfcPriceDiff} zł{t('perUnit')}
                </span>
              </span>
              <p className="text-xs text-gray-600 mt-0.5">
                {isNFCAvailable ? t('wirelessData') : t('notAvailableSizeCondition')}
              </p>
            </div>
            <button
              onClick={() => isNFCAvailable && onConfigChange({ hasNFC: !config.hasNFC })}
              disabled={!isNFCAvailable}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                config.hasNFC ? 'bg-blue-600' : 'bg-gray-300'
              } ${!isNFCAvailable ? 'cursor-not-allowed' : ''}`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  config.hasNFC ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
          </label>
        </div>

        {/* Quantity Selection */}
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-3">
            {t('quantity')}
          </label>
          <div className="grid grid-cols-3 gap-3">
            {[100, 500, 1000].map((qty) => (
              <button
                key={qty}
                onClick={() => onConfigChange({ quantity: qty })}
                className={`p-4 rounded-xl border-2 transition-all ${
                  config.quantity === qty
                    ? 'border-blue-600 bg-blue-50 shadow-md'
                    : 'border-gray-200 hover:border-blue-300'
                }`}
              >
                <div className="text-2xl font-black text-gray-900 mb-1">{qty}</div>
                <div className="text-[10px] text-gray-600">{t('units')}</div>
                {qty > 100 && (
                  <div className="text-[10px] text-green-600 font-semibold mt-1">
                    -{qty === 500 ? '25%' : '50%'}
                  </div>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Price Calculator */}
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
          <h3 className="text-lg font-bold mb-4">{t('orderSummary')}</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-sm">
              <span className="opacity-90">{t('pricePerUnit')}</span>
              <span className="text-2xl font-black">{price.perUnit} zł</span>
            </div>
            <div className="flex justify-between items-center text-sm border-t border-white/20 pt-3">
              <span className="opacity-90">{t('totalCost', { count: config.quantity })}:</span>
              <span className="text-3xl font-black">{price.total.toLocaleString()} zł</span>
            </div>
            {config.quantity > 100 && (
              <div className="bg-white/20 rounded-lg p-2 text-center text-xs">
                🎉 {t('savingsText', { percent: price.savings, count: config.quantity })}
              </div>
            )}
            
            {/* Rozbicie ceny */}
            <div className="bg-white/10 rounded-lg p-3 text-xs space-y-1 mt-3">
              <div className="flex justify-between">
                <span>{t('baseKeychain')}:</span>
                <span className="font-semibold">{price.basePriceForKeyring} zł</span>
              </div>
              {config.hasNFC && (
                <div className="flex justify-between">
                  <span>{t('nfcChip')}:</span>
                  <span className="font-semibold">+{price.nfcCostPerUnit} zł</span>
                </div>
              )}
              {(config.productionMethod === 'laser' || config.productionMethod === '3d-resin') && (
                <div className="flex justify-between">
                  <span>{t('resinCoating')}:</span>
                  <span className="font-semibold">+{price.resinCostPerUnit} zł</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => setShowPaymentModal(true)}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 text-lg"
          >
            🛒 {t('orderNow')} - {price.total.toLocaleString()} zł
          </button>

          <button
            onClick={() => setShowEmailModal(true)}
            className="w-full border-2 border-blue-500 hover:border-blue-600 hover:bg-blue-50 text-blue-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            {t('sendEmailOffer')}
          </button>

          <button
            onClick={() => setShowContactModal(true)}
            className="w-full border-2 border-purple-500 hover:border-purple-600 hover:bg-purple-50 text-purple-700 font-semibold py-3 rounded-xl transition-all flex items-center justify-center gap-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 4.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            {t('customQuote')}
          </button>
        </div>

        {/* Info box */}
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 text-sm mb-1">{t('haveUnusualIdea')}</h4>
              <p className="text-xs text-gray-600">
                {t('unusualIdeaDesc')}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Preview for Mobile */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-top-lg p-4 border-t border-gray-200 sm:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-gray-700 font-medium">{t('totalCostShort')}:</span>
          <span className="text-2xl font-bold text-green-600">{price.total.toLocaleString()} zł</span>
        </div>
        <button
          onClick={() => setShowPaymentModal(true)}
          className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition-all duration-300 text-base flex items-center justify-center gap-2"
        >
          🛒 {t('orderNow')}
        </button>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <PaymentModal
          amount={price.total}
          onClose={() => setShowPaymentModal(false)}
          config={config}
        />
      )}

      {/* Email Modal */}
      {showEmailModal && (
        <EmailOfferModal
          onClose={() => setShowEmailModal(false)}
          config={config}
          price={price}
        />
      )}

      {/* Contact Modal */}
      {showContactModal && (
        <CustomContactModal
          onClose={() => setShowContactModal(false)}
          config={config}
        />
      )}
    </>
  );
}

function PaymentModal({ amount, onClose, config }) {
  const { t } = useLanguage();
  const [processing, setProcessing] = React.useState(false);
  const [sendingEmail, setSendingEmail] = React.useState(false);
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: ''
  });

  // Determine if resin is used for the current configuration
  const isResin = config.productionMethod === 'laser' || config.productionMethod === '3d-resin';
  // Create a composite key for the stripeLinks map, as total 'amount' can be the same for different configurations.
  const linkKey = `${config.quantity}-${config.hasNFC ? 'NFC' : 'noNFC'}-${isResin ? 'Resin' : 'noResin'}`;

  // Stripe Payment Links - LIVE MODE
  // Keys are composite strings: "${quantity}-${NFC_status}-${Resin_status}"
  const stripeLinks = {
    // 100 szt base: (5 + 0 + 0) * 100 = 500
    '100-noNFC-noResin': 'https://buy.stripe.com/7sYcN57y2bVug4120Bebu00',
    // 100 szt +resin: (5 + 0 + 2) * 100 = 700
    '100-noNFC-Resin': 'https://buy.stripe.com/4gMfZh2dI3oY05320Bebu01',
    // 100 szt +NFC: (5 + 5 + 0) * 100 = 1000
    '100-NFC-noResin': 'https://buy.stripe.com/28E00j19EbVudVTbBbebu02',
    // 100 szt full (NFC+resin): (5 + 5 + 2) * 100 = 1200
    '100-NFC-Resin': 'https://buy.stripe.com/aFa7sL6tY5x63hf8oZebu03',

    // 500 szt base: (4 + 0 + 0) * 500 = 2000
    '500-noNFC-noResin': 'https://buy.stripe.com/fZu4gz9GaaRq3hf48Jebu04',
    // 500 szt +resin: (4 + 0 + 2) * 500 = 3000
    '500-noNFC-Resin': 'https://buy.stripe.com/5kQ00j8C69Nm7xv6gRebu05',
    // 500 szt +NFC: (4 + 4 + 0) * 500 = 4000
    '500-NFC-noResin': 'https://buy.stripe.com/aFa7sL9Gaf7G6trbBbebu06',
    // 500 szt full: (4 + 4 + 2) * 500 = 5000
    '500-NFC-Resin': 'https://buy.stripe.com/cNi28rf0u6BaaJHax7ebu07',

    // 1000 szt base: (3 + 0 + 0) * 1000 = 3000
    '1000-noNFC-noResin': 'https://buy.stripe.com/3cI4gz6tYf7G2dbgVvebu08',
    // 1000 szt +resin: (3 + 0 + 2) * 1000 = 5000
    '1000-noNFC-Resin': 'https://buy.stripe.com/fZufZh7y2e3CeZXbBbebu09',
    // 1000 szt +NFC: (3 + 3 + 0) * 1000 = 6000
    '1000-NFC-noResin': 'https://buy.stripe.com/aFa4gz19E4t24lj6gRebu0a',
    // 1000 szt full: (3 + 3 + 2) * 1000 = 8000
    '1000-NFC-Resin': 'https://buy.stripe.com/14A8wPf0uaRq9FDcFfebu0b'
  };


  // Oblicz cenę NFC w zależności od ilości
  const getNFCPrice = () => {
    if (config.quantity === 100) return 5;
    if (config.quantity === 500) return 4;
    if (config.quantity === 1000) return 3;
    return 5;
  };

  const getConfigSummary = () => {
    const shape = shapes.find(s => s.id === config.shape)?.nameKey || config.shape;
    const method = productionMethods.find(m => m.id === config.productionMethod)?.nameKey || config.productionMethod;
    const colorName = colors.find(c => c.value === config.color)?.name || config.color;
    const borderColorName = config.hasBorder ? (colors.find(c => c.value === config.borderColor)?.name || config.borderColor) : t('no');
    const hookPos = hookPositions.find(p => p.id === config.hookPosition)?.nameKey || config.hookPosition;
    const nfcPrice = getNFCPrice();

    return `
${t('orderStripeHeader') || 'Zamówienie przez Stripe'}

=== ${t('clientData') || 'Dane Klienta'} ===
${t('fullName') || 'Imię i Nazwisko'}: ${formData.name}
${t('email') || 'Email'}: ${formData.email}
${t('phone') || 'Telefon'}: ${formData.phone || t('notProvided') || 'Nie podano'}

=== ${t('keychainConfiguration') || 'Konfiguracja Breloka'} ===
${t('shape') || 'Kształt'}: ${t(shape)}
${t('size') || 'Rozmiar'}: ${config.shape === 'rectangle' ? `${config.width}cm × ${config.height}cm` : `${config.size}cm ${t('diameter') || 'średnica'}`}
${t('color') || 'Kolor'}: ${colorName}
${t('border') || 'Obramówka'}: ${config.hasBorder ? `${t('yes') || 'Tak'} (${borderColorName})` : t('no') || 'Nie'}
${t('productionMethod') || 'Metoda Produkcji'}: ${t(method)}
${t('nfcChip') || 'Chip NFC'}: ${config.hasNFC ? `${t('yes') || 'Tak'} (+${nfcPrice} zł/${t('unit') || 'szt'})` : t('no') || 'Nie'}
${t('hookPosition') || 'Miejsce Zaczepu'}: ${t(hookPos)}
${t('customGraphic') || 'Własna Grafika'}: ${config.showGraphic ? t('yesAttached') || 'Tak, załączona' : t('no') || 'Nie'}

=== ${t('pricingAndPayment') || 'Wycena i Płatność'} ===
${t('quantity') || 'Ilość'}: ${config.quantity} ${t('units') || 'szt'}
${t('pricePerUnit') || 'Cena za sztukę'}: ${(amount / config.quantity).toFixed(2)} zł
${t('totalValue') || 'Wartość całkowita'}: ${amount.toLocaleString()} zł

${t('statusPendingStripe') || 'Status: Oczekuje na płatność Stripe'}
    `.trim();
  };

  const handleStripePayment = async () => {
    if (!formData.name || !formData.email) {
      alert(t('fillNameEmailPrompt') || 'Proszę wypełnić imię i email.');
      return;
    }

    setSendingEmail(true);

    try {
      // 1. Wyślij email z konfiguracją zamówienia
      const emailResponse = await fetch('https://formspree.io/f/mgvnynyj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          _subject: t('orderStripeSubject', { quantity: config.quantity, amount: amount, name: formData.name }) || `Zamówienie Stripe - ${config.quantity} szt breloki - ${amount} zł - ${formData.name}`,
          message: getConfigSummary(),
          _replyto: formData.email
        })
      });

      if (!emailResponse.ok) {
        throw new Error('Błąd wysyłania emaila');
      }

      setSendingEmail(false); // Email sent, now proceed to Stripe
      setProcessing(true);
      
      const paymentLink = stripeLinks[linkKey]; 
      
      if (paymentLink) {
        const stripeUrl = new URL(paymentLink);
        // Add prefilled information for a smoother checkout, if Stripe Payment Link supports it
        stripeUrl.searchParams.set('prefilled_email', formData.email);
        stripeUrl.searchParams.set('client_reference_id', `${formData.name}-${Date.now()}`); // Unique ID for reference
        
        // Redirect after a short delay for better UX
        setTimeout(() => {
          window.location.href = stripeUrl.toString();
        }, 500);
      } else {
        alert(t('noPaymentLink') || 'Brak linku płatności dla tej konfiguracji. Skontaktuj się z nami.');
        setProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert(t('paymentError') || 'Wystąpił błąd. Spróbuj ponownie lub skontaktuj się: contact@printlab3d.eu');
      setSendingEmail(false);
      setProcessing(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const getProductionMethodName = (id) => {
    const method = productionMethods.find(m => m.id === id);
    return method ? t(method.nameKey) : id;
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full p-6 max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-2xl font-bold text-gray-900 mb-1">
              {t('stripePayment')}
            </h3>
            <p className="text-sm text-gray-600">{t('secureOnlinePayment')}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Podsumowanie */}
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-4 mb-6">
          <div className="flex justify-between items-center mb-3">
            <span className="text-gray-700 font-medium">{t('amountToPay')}:</span>
            <span className="text-3xl font-black text-blue-600">{amount.toLocaleString()} zł</span>
          </div>
          <div className="text-sm text-gray-600 space-y-1">
            <div className="flex justify-between">
              <span>{t('quantity')}:</span>
              <span className="font-semibold">{config.quantity} {t('units')}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('shape')}:</span>
              <span className="font-semibold">{t(shapes.find(s => s.id === config.shape)?.nameKey)}</span>
            </div>
            <div className="flex justify-between">
              <span>{t('method')}:</span>
              <span className="font-semibold">{getProductionMethodName(config.productionMethod)}</span>
            </div>
          </div>
        </div>

        {/* Formularz */}
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('fullName')} *
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              placeholder={t('janKowalskiPlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('email')} *
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              placeholder="jan@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('phoneOptional')}
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-0 transition-colors"
              placeholder={t('phonePlaceholder')}
            />
          </div>
        </div>

        {/* Info */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-6">
          <p className="text-xs text-blue-800">
            ℹ️ {t('orderInfo') || 'Twoje zamówienie zostanie wysłane na email. Po płatności skontaktujemy się w sprawie szczegółów produkcji.'}
          </p>
        </div>

        {/* Przycisk */}
        <button
          onClick={handleStripePayment}
          disabled={processing || sendingEmail || !formData.name || !formData.email}
          className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
        >
          {sendingEmail ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('sendingOrder') || 'Wysyłanie zamówienia...'}
            </>
          ) : processing ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {t('redirecting') || 'Przekierowywanie do Stripe...'}
            </>
          ) : (
            <>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              {t('proceedToStripe') || 'Przejdź do Płatności Stripe'}
            </>
          )}
        </button>

        {/* Security badges */}
        <div className="mt-4 text-center">
          <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
            <svg className="w-4 h-4 text-green-600" fill="currentColor" viewBox="0 0 24 24">
              <path fillRule="evenodd" d="M12 1.5C8.805 1.5 6.002 3.824 5.295 7H1.5a.5.5 0 00-.5.5v12a.5.5 0 00.5.5h17a.5.5 0 00.5-.5v-12a.5.5 0 00-.5-.5h-3.795c-.703-3.176-3.506-5.5-6.705-5.5zm-5 7a.5.5 0 01.5-.5h9a.5.5 0 01.5.5v6a.5.5 0 01-.5.5h-9a.5.5 0 01-.5-.5v-6z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">{t('securePayment')}</span>
          </div>
          <p className="text-xs text-gray-400 mt-2">
            {t('acceptedPayments')}
          </p>
        </div>
      </div>
    </div>
  );
}

// Email Offer Modal Component
function EmailOfferModal({ onClose, config, price }) {
  const { t } = useLanguage(); // Added for translation
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [error, setError] = React.useState(null);

  const getConfigSummary = () => {
    const shape = shapes.find(s => s.id === config.shape)?.nameKey || config.shape;
    const method = productionMethods.find(m => m.id === config.productionMethod)?.nameKey || config.productionMethod;

    const colorName = colors.find(c => c.value === config.color)?.name || config.color;
    const borderColorName = config.hasBorder ? (colors.find(c => c.value === config.borderColor)?.name || config.borderColor) : t('none');


    return `
${t('offerKeychainHeader')}

=== ${t('configuration')} ===
${t('shape')}: ${t(shape)}
${t('size')}: ${config.shape === 'rectangle' ? `${config.width}cm × ${config.height}cm` : `${config.size}cm ${t('diameter')}`}
${t('color')}: ${colorName}
${t('border')}: ${config.hasBorder ? `${t('yes')} (${borderColorName})` : t('no')}
${t('productionMethod')}: ${t(method)}
${t('nfcChip')}: ${config.hasNFC ? t('yes') : t('no')}
${t('hookPosition')}: ${t(hookPositions.find(p => p.id === config.hookPosition)?.nameKey || config.hookPosition)}
${config.showGraphic ? t('withCustomGraphic') : t('withoutCustomGraphic')}
${t('rotationRemoved')}

=== ${t('pricing')} ===
${t('quantity')}: ${config.quantity} ${t('units')}
${t('unitPrice')}: ${price.perUnit} zł
${t('totalValue')}: ${price.total.toLocaleString()} zł
${price.savings !== '0%' ? `${t('savings')}: ${price.savings}` : ''}

=== ${t('contactDataFilledByClient')} ===
    `.trim();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('https://formspree.io/f/mgvnynyj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          _subject: `${t('offerSubject', { quantity: config.quantity, total: price.total, name: formData.name })}`,
          message: getConfigSummary() + '\n\n' + `${t('additionalNotesFromClient')}:\n` + (formData.message || t('none')),
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setIsSent(true);
      } else {
        throw new Error(t('sendingError'));
      }
    } catch (error) {
      setError(t('emailError'));
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('offerSent')}</h3>
            <p className="text-gray-600 mb-6">
              {t('offerSentDesc')}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{t('sendEmailOffer')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Configuration Preview */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl">
          <h3 className="font-semibold text-gray-900 mb-3">{t('configSummary')}:</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div>
              <span className="text-gray-600">{t('shape')}:</span>
              <span className="font-medium ml-2">{t(shapes.find(s => s.id === config.shape)?.nameKey)}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('quantity')}:</span>
              <span className="font-medium ml-2">{config.quantity} {t('units')}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('method')}:</span>
              <span className="font-medium ml-2">{t(productionMethods.find(m => m.id === config.productionMethod)?.nameKey)}</span>
            </div>
            <div>
              <span className="text-gray-600">{t('price')}:</span>
              <span className="font-bold ml-2 text-green-600">{price.total.toLocaleString()} zł</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder={t('janKowalskiPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('email')} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('phoneOptional')}
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
              placeholder={t('phonePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('additionalNotes')}
            </label>
            <textarea
              rows={4}
              value={formData.message}
              onChange={(e) => setFormData({...formData, message: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none resize-none"
              placeholder={t('additionalNotesPlaceholder')}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
                {t('sendOffer')}
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

// Custom Contact Modal Component
function CustomContactModal({ onClose, config }) {
  const { t } = useLanguage(); // Added for translation
  const [formData, setFormData] = React.useState({
    name: '',
    email: '',
    phone: '',
    idea: ''
  });
  const [isSending, setIsSending] = React.useState(false);
  const [isSent, setIsSent] = React.useState(false);
  const [error, setError] = React.useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSending(true);
    setError(null);

    try {
      const response = await fetch('https://formspree.io/f/mgvnynyj', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          _subject: `${t('customQuoteSubject', { name: formData.name })}`,
          message: `
${t('customProjectRequest')}

${t('customProjectRequestDesc')}

=== ${t('contactData')} ===
${t('name')}: ${formData.name}
${t('email')}: ${formData.email}
${t('phone')}: ${formData.phone || t('notProvided')}

=== ${t('ideaDescription')} ===
${formData.idea}

=== ${t('currentConfigForContext')} ===
${t('shape')}: ${t(shapes.find(s => s.id === config.shape)?.nameKey || config.shape)}
${t('size')}: ${config.shape === 'rectangle' ? `${config.width}cm × ${config.height}cm` : `${config.size}cm`}
${t('color')}: ${colors.find(c => c.value === config.color)?.name || config.color}
${t('border')}: ${config.hasBorder ? `${t('yes')} (${colors.find(c => c.value === config.borderColor)?.name || config.borderColor})` : t('no')}
${t('method')}: ${t(productionMethods.find(m => m.id === config.productionMethod)?.nameKey || config.productionMethod)}
${t('nfc')}: ${config.hasNFC ? t('yes') : t('no')}
${t('hookPosition')}: ${t(hookPositions.find(p => p.id === config.hookPosition)?.nameKey || config.hookPosition)}
${t('graphic')}: ${config.showGraphic ? `${t('yes')} (${t('scale')}: ${config.graphicScale}%)` : t('no')}
${t('rotationRemoved')}
          `.trim(),
          _replyto: formData.email
        })
      });

      if (response.ok) {
        setIsSent(true);
      } else {
        throw new Error(t('sendingError'));
      }
    } catch (error) {
      setError(t('contactError'));
    } finally {
      setIsSending(false);
    }
  };

  if (isSent) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{t('requestSent')}</h3>
            <p className="text-gray-600 mb-6">
              {t('requestSentDesc')}
            </p>
            <button
              onClick={onClose}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition-colors"
            >
              {t('close')}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl my-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{t('customQuote')}</h2>
            <p className="text-sm text-gray-600 mt-1">{t('customQuoteSubtitle')}</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Info Box */}
        <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl">
          <div className="flex items-start gap-3">
            <svg className="w-6 h-6 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div>
              <h4 className="font-semibold text-gray-900 mb-1">{t('whatCanWeDo')}</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• {t('unusualShapesSizes')}</li>
                <li>• {t('specialColorsEffects')}</li>
                <li>• {t('complexProjects')}</li>
                <li>• {t('customNFCIntegration')}</li>
                <li>• {t('sampleProduction')}</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('fullName')} *
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder={t('janKowalskiPlaceholder')}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                {t('email')} *
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
                placeholder="email@example.com"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('phone')} *
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none"
              placeholder={t('phonePlaceholder')}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              {t('describeIdea')} *
            </label>
            <textarea
              rows={6}
              required
              value={formData.idea}
              onChange={(e) => setFormData({...formData, idea: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none"
              placeholder={t('describeIdeaPlaceholder')}
            />
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isSending}
            className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold py-4 rounded-xl shadow-lg transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
          >
            {isSending ? (
              <>
                <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {t('sending')}
              </>
            ) : (
              <>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 4.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('sendRequest')}
              </>
            )}
          </button>

          <p className="text-xs text-gray-500 text-center">
            {t('responseTime')}
          </p>
        </form>
      </div>
    </div>
  );
}
