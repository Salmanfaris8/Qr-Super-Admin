import React from "react";
import { TemplateConfig, DEFAULT_TEMPLATE3_CONFIG } from "../pages/Templateconfig";
import { alignToFlex, alignToTextAlign } from "../utils/templateStyleUtils";
import { Facebook, Instagram, Twitter, MapPin, Phone } from "lucide-react";

interface Template3Props {
  config?: TemplateConfig;
}

const coffeeClassic = [
  { name: "Espresso", price: "₹3.00" },
  { name: "Americano", price: "₹3.50" },
  { name: "Cappuccino", price: "₹4.50" },
  { name: "Flat White", price: "₹4.50" },
  { name: "Mocha", price: "₹5.50" },
];

const icedCoffee = [
  { name: "Iced Americano", price: "₹4.00" },
  { name: "Iced Latte", price: "₹5.00" },
  { name: "Iced Mocha", price: "₹5.50" },
  { name: "Caramel Macchiato", price: "₹5.50" },
  { name: "Cold Brew", price: "₹4.50" },
];

const teaItems = [
  { name: "Thai Tea", price: "₹4.50" },
  { name: "Chai Tea", price: "₹4.50" },
  { name: "Matcha Latte", price: "₹5.50" },
  { name: "Hot Chocolate", price: "₹4.50" },
  { name: "Herbal Tea", price: "₹3.50" },
];

const snacks = [
  { name: "Croissant", price: "₹3.50" },
  { name: "Blueberry Muffin", price: "₹3.00" },
  { name: "Chocolate Cookie", price: "₹2.50" },
  { name: "Avocado Toast", price: "₹6.50" },
];

const Template3: React.FC<Template3Props> = ({ config = DEFAULT_TEMPLATE3_CONFIG }) => {
  const primaryColor = config.primaryColor;
  const backgroundColor = config.backgroundColor;
  const headerAlign = config.headerSection?.alignment ?? "center";
  const menuTypography = config.menuSection?.typography;
  const footer = config.footer;
  const showPrice = config.layout.showPriceTag;
  const showDividers = config.layout.showDividers;
  const menuColumns = Math.min(2, Math.max(1, config.layout.menuColumns));

  const MenuSection = ({
    title,
    items,
  }: {
    title: string;
    items: { name: string; price: string }[];
  }) => (
    <div className="t3-menu-section">
      <h2 className="t3-section-title">{title}</h2>
      <div className="t3-items-list">
        {items.map((item, index) => (
          <div key={index} className="t3-menu-item">
            <span className="t3-item-name">{item.name}</span>
            {showPrice && <span className="t3-item-price">{item.price}</span>}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=DM+Sans:wght@400;500;600&display=swap');

        .template3-wrapper * { box-sizing: border-box; }

        .template3-wrapper {
          width: 100%;
          max-width: 480px;
          margin: 0 auto;
          background-color: ${backgroundColor};
          font-family: 'DM Sans', sans-serif;
          color: ${primaryColor};
          padding: 32px 28px;
          position: relative;
          overflow: hidden;
        }

        /* Header */
        .t3-header {
          display: flex;
          flex-direction: column;
          align-items: ${alignToFlex(headerAlign)};
          text-align: ${alignToTextAlign(headerAlign)};
          margin-bottom: 36px;
        }

        .t3-logo {
          width: 72px;
          height: 72px;
          border-radius: 50%;
          object-fit: contain;
          margin-bottom: 12px;
        }

        .t3-main-title {
          font-family: 'Playfair Display', serif;
          font-size: ${config.headerSection?.typography?.headingFontSize ?? 64}px;
          font-weight: ${config.headerSection?.typography?.headingFontWeight ?? 900};
          color: ${primaryColor};
          line-height: 1;
          margin: 0 0 12px 0;
          letter-spacing: 2px;
        }

        .t3-header-meta {
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          font-size: ${config.headerSection?.typography?.contentFontSize ?? 11}px;
          font-weight: ${config.headerSection?.typography?.contentFontWeight ?? 500};
          color: ${primaryColor};
          margin-top: 8px;
          gap: 8px;
        }

        .t3-shop-badge {
          border: 1.5px solid ${primaryColor};
          border-radius: 50px;
          padding: 6px 16px;
          text-align: center;
          line-height: 1.4;
          white-space: nowrap;
          margin-bottom: 10px
        }

        .t3-shop-badge p { margin: 0; }
        .t3-shop-badge .badge-name {
          font-weight: 700;
          font-size: 12px;
        }

        /* Menu Grid */
        .t3-menu-grid {
          display: grid;
          grid-template-columns: repeat(${menuColumns}, 1fr);
          gap: ${config.spacing.cardGap}px;
        }

        .t3-menu-section { }

        .t3-section-title {
          color: ${primaryColor};
          font-family: 'Playfair Display', serif;
          font-size: ${menuTypography?.headingFontSize ?? 18}px;
          font-weight: ${menuTypography?.headingFontWeight ?? 700};
          margin: 0 0 12px 0;
          padding-bottom: ${showDividers ? "8px" : "0"};
          border-bottom: ${showDividers ? `1.5px solid ${primaryColor}` : "none"};
          text-align: ${alignToTextAlign(config.menuSection?.layout?.headerAlignment ?? "start")};
        }

        .t3-items-list {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .t3-menu-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: ${primaryColor};
          font-size: ${menuTypography?.contentFontSize ?? 13}px;
          font-weight: ${menuTypography?.contentFontWeight ?? 400};
        }

        .t3-item-name { opacity: 0.85; }
        .t3-item-price { font-weight: 600; color: ${config.accentColor}; }

        /* Cup illustration slot */
        .t3-cup-area {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          margin-top: 24px;
          font-size: 100px;
          line-height: 1;
        }

        /* Footer */
        .t3-footer {
          border-top: 1.5px solid ${primaryColor};
          margin-top: ${config.spacing.sectionSpacing}px;
          padding-top: 24px;
          text-align: ${alignToTextAlign(footer?.headingAlignment ?? "center")};
          color: ${primaryColor};
        }

        .t3-footer-title {
          font-family: 'Playfair Display', serif;
          font-size: ${footer?.headingFontSize ?? 18}px;
          font-weight: 700;
          margin: 0 0 8px 0;
        }

        .t3-footer-detail {
          display: flex;
          align-items: center;
          justify-content: ${alignToFlex(footer?.addressAlignment ?? "center")};
          gap: 6px;
          font-size: ${footer?.addressFontSize ?? 12}px;
          color: ${primaryColor};
          opacity: 0.85;
          margin-top: 6px;
        }

        .t3-social-row {
          display: flex;
          justify-content: ${alignToFlex(footer?.iconsAlignment ?? "center")};
          gap: 18px;
          margin-top: 18px;
        }

        .t3-social-btn {
          background: none;
          border: none;
          padding: 0;
          cursor: pointer;
          color: ${primaryColor};
          display: flex;
          align-items: center;
        }

        @media (max-width: 480px) {
          .t3-menu-grid { grid-template-columns: 1fr; }
          .t3-main-title { font-size: 48px; }
          .template3-wrapper { padding: 20px 16px; }
        }
      `}</style>

      <div className="template3-wrapper">
        {/* Header */}
        <div className="t3-header">
          <img src="https://png.pngtree.com/png-clipart/20200727/original/pngtree-restaurant-logo-design-vector-template-png-image_5441058.jpg" alt="logo" className="t3-logo" />
          <div className="t3-shop-badge">
              <p className="badge-name">RIMBERIO</p>
              {/* <p>COFFEESHOP</p> */}
            </div>
          <h1 className="t3-main-title">MENU</h1>
        </div>

        {/* Menu Grid */}
        <div className="t3-menu-grid">
          <MenuSection title="Coffee Classics" items={coffeeClassic} />
          <MenuSection title="Iced Coffee" items={icedCoffee} />
          <MenuSection title="Tea & Non-Coffee" items={teaItems} />

          <div>
            <MenuSection title="Pastries & Snacks" items={snacks} />
            
          </div>
        </div>

        {/* Footer */}
        <div className="t3-footer">
          <h2 className="t3-footer-title">Rimberio Coffee Shop</h2>
          <div className="t3-footer-detail">
            <MapPin size={13} />
            <span>123 Anywhere St, Any City</span>
          </div>
          <div className="t3-footer-detail">
            <Phone size={13} />
            <span>+91 9876543210</span>
          </div>
          <div className="t3-social-row">
            <button className="t3-social-btn" aria-label="Facebook">
              <Facebook size={20} />
            </button>
            <button className="t3-social-btn" aria-label="Instagram">
              <Instagram size={20} />
            </button>
            <button className="t3-social-btn" aria-label="Twitter">
              <Twitter size={20} />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Template3;