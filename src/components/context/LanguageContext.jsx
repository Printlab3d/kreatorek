
import React, { createContext, useContext, useState } from 'react';

const LanguageContext = createContext();

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

const translations = {
  en: {
    // Keychain Creator
    designYourKeychain: 'Design Your Keychain',
    personalizeKeychain: 'Personalize the shape, color and features of your keychain',
    keychainShape: 'Keychain Shape',
    circle: 'Circle',
    square: 'Square',
    rectangle: 'Rectangle',
    hexagon: 'Hexagon',
    octagon: 'Octagon',
    diamond: 'Diamond',
    size: 'Size',
    width: 'Width',
    height: 'Height',
    productionMethod: 'Production Method',
    full3DPrint: 'Full 3D Print',
    max4Colors: 'Max 4 colors',
    laserResin: 'Laser + Resin',
    unlimitedColors: 'Unlimited colors + glass effect',
    print3DResin: '3D Print + Resin',
    max4ColorsGlass: 'Max 4 colors + glass effect',
    customGraphic: 'Custom Graphic (Logo)',
    clickToAdd: 'Click to add graphic',
    pngTransparent: 'PNG with transparent background (up to 5MB)',
    graphicSize: 'Graphic Size',
    small: 'Small',
    medium: 'Medium',
    large: 'Large',
    removeGraphic: 'Remove graphic',
    keychainColor: 'Keychain Color',
    border: 'Border',
    recommended: 'RECOMMENDED',
    increasesStrength: 'Increases strength and appearance',
    hookPosition: 'Hook Position',
    topCenter: 'Top - Center',
    topLeft: 'Top - Left',
    topRight: 'Top - Right',
    sideLeft: 'Side - Left',
    sideRight: 'Side - Right',
    nfcChip: 'NFC Chip',
    perUnit: '/unit',
    wirelessData: 'Wireless data transfer',
    notAvailable: 'Not available for size < 2.5cm',
    quantity: 'Quantity',
    units: 'units',
    orderSummary: 'Order Summary',
    pricePerUnit: 'Price per unit:',
    totalCost: 'Total cost ({count} pcs):',
    savings: '🎉 You save {percent} by buying {count} units!',
    baseKeychain: 'Base keychain:',
    resinCoating: 'Resin coating:',
    orderNow: 'Order Now',
    sendEmailOffer: 'Send Email Offer',
    customQuote: 'Custom Quote',
    haveUnusualIdea: 'Have an unusual idea?',
    unusualIdeaDesc: 'Contact us - we\'ll adapt our production capabilities to your creativity! We can realize special projects, unusual shapes and unique solutions.',
    dragToRotate: 'Drag to rotate',
    '3dCreator': '3D Creator',
    backText: 'Text on Back (optional)',
    backTextPlaceholder: 'e.g. +48 123 456 789',
    backTextDesc: 'You can add phone number, name or other short text (max {count} characters for current size)',
    
    // Services Section
    ourServices: 'Our Services',
    technologyInnovates: 'Technology That Innovates',
    servicesDescription: 'Discover our cutting-edge solutions combining 3D printing with smart NFC technology',
    keychainsTitle: '3D Keychains with NFC',
    keychainsFullDesc: 'Personalized keychains with integrated NFC technology for instant data transfer',
    keychainsFeatures: ['Custom shapes and colors', 'Integrated NFC chip', 'Resin coating option', 'Logo printing'],
    standsTitle: 'Interactive NFC Stands',
    standsFullDesc: 'Smart phone stands with NFC technology for instant content display',
    standsFeatures: ['Modern design', 'Wireless charging', 'Business card integration', 'Multiple angles'],
    arMenusTitle: 'AR Digital Menus',
    arMenusFullDesc: 'Revolutionary restaurant menus with augmented reality visualization',
    arMenusFeatures: ['3D food visualization', 'Interactive experience', 'Instant updates', 'Multi-language support'],
    poweredByTech: 'Powered by Advanced Technology',
    techDescription: 'We use the latest 3D printing techniques combined with NFC technology to create innovative solutions',
    
    // Payment Modal
    stripePayment: 'Stripe Payment',
    amountToPay: 'Amount to pay:',
    shape: 'Shape',
    method: 'Method',
    fullNamePayment: 'Full Name',
    email: 'Email',
    phone: 'Phone',
    phoneOptional: 'Phone (optional)',
    proceedToStripe: 'Proceed to Stripe Payment',
    sendingOrder: 'Sending order...',
    redirecting: 'Redirecting to Stripe...',
    securePayment: 'Secure SSL Payment',
    acceptedPayments: 'We accept: BLIK, Visa, Mastercard, Apple Pay, Google Pay',
    orderInfo: 'ℹ️ Your order will be sent via email. After payment we\'ll contact you about production details.',

    
    // Email Offer Modal
     emailOfferTitle: 'Send Email Offer',
    configSummary: 'Configuration Summary:',
    subject: 'Subject',
    subjectPlaceholderEmail: 'How can we help?',
    message: 'Message',
    additionalNotes: 'Additional notes (optional)',
    additionalNotesPlaceholder: 'Additional information, questions or special requirements...',
    sending: 'Sending...',
    sendOffer: 'Send Offer',
    offerSent: 'Offer Sent!',
    willContactYou: 'We\'ll contact you within 24 hours with an individual offer.',
    close: 'Close',
    
    // Custom Contact Modal
    customQuoteTitle: 'Custom Quote',
    adaptToCreativity: 'We\'ll adapt our capabilities to your creativity',
    whatWeCanDo: 'What can we do for you?',
    unusualShapes: '• Unusual shapes and sizes',
    specialColors: '• Special colors and effects',
    complexProjects: '• Complex projects with multiple elements',
    customNFC: '• NFC integration tailored to your needs',
    testProduction: '• Test production before full order',
    describeIdea: 'Describe your idea',
    describeIdeaPlaceholder: 'Describe exactly what you want to achieve... e.g. keychain in company logo shape, special dimensions, unique colors, NFC functions, quantity, deadline, etc.',
    sendInquiry: 'Send Inquiry',
    willRespond: 'We\'ll respond within 24 business hours',
    inquirySent: 'Inquiry Sent!',
    inquirySentDesc: 'Our team will contact you within 24 hours to discuss details and tailor a solution to your needs.',
    
    // Header
    services: 'Services',
    portfolio: 'Portfolio',
    about: 'About',
    contact: 'Contact',
    getQuote: 'Get Quote',
    
    // Hero Section
    heroTagline: 'We combine 3D printing and smart NFC technology to make ideas come to life.',
    heroDescription: 'Transforming ideas into reality with cutting-edge 3D printing, smart NFC integration, and immersive digital experiences',
    exploreServices: 'Explore Our Services',
    watchDemo: 'See Our Products',
    keychains: '3D Keychains',
    keychainsDesc: 'Custom designs with NFC',
    smartStands: 'NFC Stand',
    smartStandsDesc: 'Interactive display',
    digitalMenus: 'Digital Menus',
    digitalMenusDesc: 'AR food visualization',
    
    // Portfolio
    innovationShowcase: 'Innovation Showcase',
    portfolioDescription: 'See how we transform ideas into reality with 3D printing and NFC technology',
    allProjects: 'All Projects',
    corporateKeychains: 'Corporate Keychains',
    corporateKeychainsDesc: 'Professional keychains with NFC for business',
    customKeychains: 'Custom Keychains',
    customKeychainsDesc: 'Personalized designs for special occasions',
    displayStand: 'Display Stand',
    displayStandDesc: 'Interactive NFC phone stand',
    arMenuSystem: 'AR Menu System',
    arMenuSystemDesc: 'Digital menus with augmented reality',
    view: 'View',
    
    // About
    aboutPrintLab: 'About PrintLab3D',
    aboutDescription: 'We are a team of passionate innovators combining traditional 3D printing with cutting-edge NFC technology',
    projectsCompleted: 'Projects Completed',
    happyClients: 'Happy Clients',
    coretech: 'Core Technologies',
    supportAvailable: 'Support Available',
    shapingFuture: 'Shaping the Future of 3D Printing',
    companyStory1: 'Founded in 2024, PrintLab3D started with a vision to revolutionize how people interact with physical objects through technology.',
    companyStory2: 'Today, we\'re proud to serve clients across Europe, delivering innovative solutions that combine aesthetics, functionality, and smart technology.',
    polishQuality: 'Polish Quality',
    globalReach: 'Global Reach',
    coreValues: 'Our Core Values',
    precisionEngineering: 'Precision Engineering',
    precisionDesc: 'Every product is crafted with meticulous attention to detail',
    innovationFirst: 'Innovation First',
    innovationDesc: 'We constantly explore new technologies and techniques',
    clientCentered: 'Client-Centered',
    clientDesc: 'Your vision drives our creative process',
    qualityAssured: 'Quality Assured',
    qualityDesc: 'We stand behind every product we create',
    
    // Contact
     fullName: 'Full Name',
    emailAddress: 'Email Address',
    subjectPlaceholder: 'What can we help you with?',
    messagePlaceholder: 'Tell us about your project...',
    sendMessage: 'Send Message',
    messageSent: 'Message Sent!',
    thankYou: 'Thank you for reaching out! We\'ll get back to you within 24 hours.',
    sendAnother: 'Send Another Message',
    // Footer
    footerDescription: 'We transform ideas into reality.',
    company: 'Company',
    aboutUs: 'About Us',
    allRights: 'All rights reserved.',
    madeWithLove: 'Made with ❤️ in Europe'
  },
  
  pl: {
    // Keychain Creator
    designYourKeychain: 'Zaprojektuj Swój Brelok',
    personalizeKeychain: 'Personalizuj kształt, kolor i funkcje swojego breloka',
    keychainShape: 'Kształt Breloka',
    circle: 'Koło',
    square: 'Kwadrat',
    rectangle: 'Prostokąt',
    hexagon: 'Sześciokąt',
    octagon: 'Ośmiokąt',
    diamond: 'Diament',
    size: 'Rozmiar',
    width: 'Szerokość',
    height: 'Wysokość',
    productionMethod: 'Metoda Produkcji',
    full3DPrint: 'Pełny Druk 3D',
    max4Colors: 'Max 4 kolory',
    laserResin: 'Laser + Żywica',
    unlimitedColors: 'Nielimitowane kolory + efekt szkła',
    print3DResin: 'Druk 3D + Żywica',
    max4ColorsGlass: 'Max 4 kolory + efekt szkła',
    customGraphic: 'Własna Grafika (Logo)',
    clickToAdd: 'Kliknij aby dodać grafikę',
    pngTransparent: 'PNG z przezroczystym tłem (do 5MB)',
    graphicSize: 'Rozmiar Grafiki',
    small: 'Małe',
    medium: 'Średnie',
    large: 'Duże',
    removeGraphic: 'Usuń grafikę',
    keychainColor: 'Kolor Breloka',
    border: 'Obramówka',
    recommended: 'POLECANE',
    increasesStrength: 'Zwiększa wytrzymałość i wygląd',
    hookPosition: 'Miejsce Zaczepu',
    topCenter: 'Góra - Środek',
    topLeft: 'Góra - Lewo',
    topRight: 'Góra - Prawo',
    sideLeft: 'Bok - Lewo',
    sideRight: 'Bok - Prawo',
    nfcChip: 'Chip NFC',
    perUnit: '/szt',
    wirelessData: 'Bezprzewodowy transfer danych',
    notAvailable: 'Niedostępne dla rozmiaru < 2.5cm',
    quantity: 'Ilość Sztuk',
    units: 'sztuk',
    orderSummary: 'Podsumowanie Zamówienia',
    pricePerUnit: 'Cena za sztukę:',
    totalCost: 'Łączny koszt ({count} szt):',
    savings: '🎉 Oszczędzasz {percent} kupując {count} sztuk!',
    baseKeychain: 'Brelok podstawowy:',
    resinCoating: 'Powłoka żywiczna:',
    orderNow: 'Zamów Teraz',
    sendEmailOffer: 'Wyślij Ofertę Email',
    customQuote: 'Indywidualna Wycena',
    haveUnusualIdea: 'Masz nietypowy pomysł?',
    unusualIdeaDesc: 'Skontaktuj się z nami - dopasujemy nasze możliwości produkcyjne pod Twoją kreatywność! Możemy zrealizować specjalne projekty, nietypowe kształty i unikalne rozwiązania.',
    dragToRotate: 'Przeciągnij aby obrócić',
    '3dCreator': 'Kreator 3D',
    backText: 'Tekst na Tyle Breloka (opcjonalnie)',
    backTextPlaceholder: 'np. +48 123 456 789',
    backTextDesc: 'Możesz dodać numer telefonu, imię lub inny krótki tekst (max {count} znaków dla obecnego rozmiaru)',
    
    // Services Section
    ourServices: 'Nasze Usługi',
    technologyInnovates: 'Technologia Która Innowuje',
    servicesDescription: 'Odkryj nasze najnowocześniejsze rozwiązania łączące druk 3D z inteligentną technologią NFC',
    keychainsTitle: 'Breloki 3D z NFC',
    keychainsFullDesc: 'Spersonalizowane breloki z wbudowaną technologią NFC do natychmiastowego transferu danych',
    keychainsFeatures: ['Własne kształty i kolory', 'Wbudowany chip NFC', 'Opcja powłoki żywicznej', 'Nadruk logo'],
    standsTitle: 'Interaktywne Stojaki NFC',
    standsFullDesc: 'Inteligentne stojaki na telefon z technologią NFC do natychmiastowego wyświetlania treści',
    standsFeatures: ['Nowoczesny design', 'Ładowanie bezprzewodowe', 'Integracja wizytówki', 'Wiele kątów'],
    arMenusTitle: 'Cyfrowe Menu AR',
    arMenusFullDesc: 'Rewolucyjne menu restauracyjne z wizualizacją w rozszerzonej rzeczywistości',
    arMenusFeatures: ['Wizualizacja 3D dań', 'Interaktywne doświadczenie', 'Natychmiastowe aktualizacje', 'Wsparcie wielu języków'],
    poweredByTech: 'Napędzane Zaawansowaną Technologią',
    techDescription: 'Wykorzystujemy najnowsze techniki druku 3D połączone z technologią NFC do tworzenia innowacyjnych rozwiązań',
    
    // Payment Modal
    stripePayment: 'Płatność Stripe',
    amountToPay: 'Do zapłaty:',
    shape: 'Kształt',
    method: 'Metoda',
    fullNamePayment: 'Imię i Nazwisko',
    email: 'Email',
    phone: 'Telefon',
    phoneOptional: 'Telefon (opcjonalnie)',
    proceedToStripe: 'Przejdź do Płatności Stripe',
    sendingOrder: 'Wysyłanie zamówienia...',
    redirecting: 'Przekierowywanie do Stripe...',
    securePayment: 'Bezpieczna płatność SSL',
    acceptedPayments: 'Akceptujemy: BLIK, Visa, Mastercard, Apple Pay, Google Pay',
    orderInfo: 'ℹ️ Twoje zamówienie zostanie wysłane na email. Po płatności skontaktujemy się w sprawie szczegółów produkcji.',

    
    // Email Offer Modal
      emailOfferTitle: 'Wyślij Ofertę Email',
    configSummary: 'Podsumowanie Konfiguracji:',
    subject: 'Temat',
    subjectPlaceholderEmail: 'W czym możemy pomóc?',
    message: 'Wiadomość',
    additionalNotes: 'Dodatkowe uwagi (opcjonalnie)',
    additionalNotesPlaceholder: 'Dodatkowe informacje, pytania lub specjalne wymagania...',
    sending: 'Wysyłanie...',
    sendOffer: 'Wyślij Ofertę',
    offerSent: 'Oferta Wysłana!',
    willContactYou: 'Skontaktujemy się z Tobą w ciągu 24 godzin z indywidualną ofertą.',
    close: 'Zamknij',
    
    // Custom Contact Modal
    customQuoteTitle: 'Indywidualna Wycena',
    adaptToCreativity: 'Dopasujemy nasze możliwości pod Twoją kreatywność',
    whatWeCanDo: 'Co możemy dla Ciebie zrobić?',
    unusualShapes: '• Nietypowe kształty i rozmiary',
    specialColors: '• Specjalne kolory i efekty',
    complexProjects: '• Kompleksowe projekty z wieloma elementami',
    customNFC: '• Integracja z systemami NFC na miarę',
    testProduction: '• Produkcja próbna przed pełnym zamówieniem',
    describeIdea: 'Opisz swój pomysł',
    describeIdeaPlaceholder: 'Opisz dokładnie co chcesz osiągnąć... np. brelok w kształcie logo firmy, specjalne wymiary, unikalne kolory, funkcje NFC, ilość sztuk, termin realizacji, itp.',
    sendInquiry: 'Wyślij Zapytanie',
    willRespond: 'Odpowiemy w ciągu 24 godzin roboczych',
    inquirySent: 'Zgłoszenie Wysłane!',
    inquirySentDesc: 'Nasz zespół skontaktuje się z Tobą w ciągu 24 godzin, aby omówić szczegóły i dopasować rozwiązanie do Twoich potrzeb.',
    
    // Header
    services: 'Usługi',
    portfolio: 'Portfolio',
    about: 'O Nas',
    contact: 'Kontakt',
    getQuote: 'Wycena',
    
    // Hero Section
    heroTagline: 'Łączymy druk 3D i inteligentną technologię NFC, by pomysły stawały się rzeczywistością.',
    heroDescription: 'Przekształcamy pomysły w rzeczywistość dzięki najnowocześniejszemu drukowi 3D, inteligentnej integracji NFC i immersyjnym doświadczeniom cyfrowym',
    exploreServices: 'Poznaj Nasze Usługi',
    watchDemo: 'Zobacz Nasze Produkty',
    keychains: 'Breloki 3D',
    keychainsDesc: 'Projekty na zamówienie z NFC',
    smartStands: 'Stojak z NFC',
    smartStandsDesc: 'Interaktywna ekspozycja',
    digitalMenus: 'Menu Cyfrowe',
    digitalMenusDesc: 'Wizualizacja jedzenia AR',
    
    // Portfolio
    innovationShowcase: 'Pokaz Innowacji',
    portfolioDescription: 'Zobacz jak przekształcamy pomysły w rzeczywistość dzięki drukowi 3D i technologii NFC',
    allProjects: 'Wszystkie Projekty',
    corporateKeychains: 'Breloki Firmowe',
    corporateKeychainsDesc: 'Profesjonalne breloki z NFC dla biznesu',
    customKeychains: 'Breloki Na Zamówienie',
    customKeychainsDesc: 'Spersonalizowane projekty na specjalne okazje',
    displayStand: 'Stojak Ekspozycyjny',
    displayStandDesc: 'Interaktywny stojak na telefon z NFC',
    arMenuSystem: 'System Menu AR',
    arMenuSystemDesc: 'Cyfrowe menu z rozszerzoną rzeczywistością',
    view: 'Zobacz',
    
    // About
    aboutPrintLab: 'O PrintLab3D',
    aboutDescription: 'Jesteśmy zespołem pasjonatów innowacji łączących tradycyjny druk 3D z najnowocześniejszą technologią NFC',
    projectsCompleted: 'Zrealizowanych Projektów',
    happyClients: 'Zadowolonych Klientów',
    coretech: 'Kluczowe Technologie',
    supportAvailable: 'Dostępne Wsparcie',
    shapingFuture: 'Kształtujemy Przyszłość Druku 3D',
    companyStory1: 'Założona w 2024 roku, PrintLab3D powstała z wizji rewolucjonizacji sposobu, w jaki ludzie wchodzą w interakcję z fizycznymi obiektami poprzez technologię.',
    companyStory2: 'Dziś z dumą obsługujemy klientów w całej Europie, dostarczając innowacyjne rozwiązania łączące estetykę, funkcjonalność i inteligentną technologię.',
    polishQuality: 'Polska Jakość',
    globalReach: 'Globalny Zasięg',
    coreValues: 'Nasze Wartości',
    precisionEngineering: 'Precyzyjna Inżynieria',
    precisionDesc: 'Każdy produkt jest tworzony z drobiazgową dbałością o szczegóły',
    innovationFirst: 'Innowacyjność Przede Wszystkim',
    innovationDesc: 'Nieustannie eksplorujemy nowe technologie i techniki',
    clientCentered: 'Klient w Centrum',
    clientDesc: 'Twoja wizja napędza nasz proces twórczy',
    qualityAssured: 'Gwarantowana Jakość',
    qualityDesc: 'Stoimy za każdym produktem, który tworzymy',
    
    // Contact
    fullName: 'Imię i Nazwisko',
    emailAddress: 'Adres Email',
    subjectPlaceholder: 'W czym możemy pomóc?',
    messagePlaceholder: 'Opowiedz nam o swoim projekcie...',
    sendMessage: 'Wyślij Wiadomość',
    messageSent: 'Wiadomość Wysłana!',
    thankYou: 'Dziękujemy za kontakt! Odpowiemy w ciągu 24 godzin.',
    sendAnother: 'Wyślij Kolejną Wiadomość',
    // Footer
    footerDescription: 'Przekształcamy pomysły w rzeczywistość.',
    company: 'Firma',
    aboutUs: 'O Nas',
    allRights: 'Wszystkie prawa zastrzeżone.',
    madeWithLove: 'Stworzone z ❤️ w Europie'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('pl');
  
  const t = (key, params = {}) => {
    let translation = translations[language][key] || key;
    
    // Replace parameters in translation
    Object.keys(params).forEach(paramKey => {
      translation = translation.replace(`{${paramKey}}`, params[paramKey]);
    });
    
    return translation;
  };
  
  const changeLanguage = (newLanguage) => {
    setLanguage(newLanguage);
  };
  
  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};
