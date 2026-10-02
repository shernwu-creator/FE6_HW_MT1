import { useState, useEffect, useMemo } from 'react'
import '../styles/gear.css'

// 預設裝備清單資料（含預估單項重量，單位：克）
const INITIAL_GEAR_DATA = [
  // 衣物與睡眠
  { id: 'gear-1', name: '防水防風外套 (Gore-Tex Shell)', weightGrams: 420, category: '衣物睡眠', required: true },
  { id: 'gear-2', name: '吸濕排汗底層衣', weightGrams: 180, category: '衣物睡眠', required: true },
  { id: 'gear-3', name: '羽絨保暖外套', weightGrams: 350, category: '衣物睡眠', required: true },
  { id: 'gear-4', name: '高山登山鞋', weightGrams: 1200, category: '衣物睡眠', required: true },
  { id: 'gear-5', name: '三季羽絨睡袋 (-5°C)', weightGrams: 850, category: '衣物睡眠', required: false },

  // 炊事與水具
  { id: 'gear-6', name: '輕量化高山攻頂爐頭', weightGrams: 85, category: '炊事水具', required: false },
  { id: 'gear-7', name: '鈦合金個人煮食鍋具', weightGrams: 160, category: '炊事水具', required: false },
  { id: 'gear-8', name: '登山水袋 (2L)', weightGrams: 140, category: '炊事水具', required: true },
  { id: 'gear-9', name: '戶外高效淨水器', weightGrams: 90, category: '炊事水具', required: true },

  // 電子與導航
  { id: 'gear-10', name: '高亮度頭燈 (含備用電池)', weightGrams: 110, category: '電子導航', required: true },
  { id: 'gear-11', name: '10000mAh 行動電源', weightGrams: 220, category: '電子導航', required: true },
  { id: 'gear-12', name: 'GPS 登山手錶/離線地圖手機', weightGrams: 200, category: '電子導航', required: true },

  // 安全與急救
  { id: 'gear-13', name: '個人高山急救包', weightGrams: 280, category: '安全急救', required: true },
  { id: 'gear-14', name: '求生求救哨', weightGrams: 15, category: '安全急救', required: true },
  { id: 'gear-15', name: '超輕保暖求生毯', weightGrams: 50, category: '安全急救', required: true },
  { id: 'gear-16', name: '輕量鋁合金登山杖 (一對)', weightGrams: 450, category: '安全急救', required: false },
];

const LOCAL_STORAGE_KEY = 'peak_explore_gear_checklist';

export default function Gear() {
  // 1. 初始化 State：從 localStorage 讀取紀錄，若無則為空物件
  const [checkedItems, setCheckedItems] = useState(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch (error) {
      console.error('無法讀取 localStorage 紀錄:', error);
      return {};
    }
  });

  const [activeCategory, setActiveCategory] = useState('All');

  // 2. 當 checkedItems 變更時，自動更新至 localStorage
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(checkedItems));
    } catch (error) {
      console.error('無法寫入 localStorage:', error);
    }
  }, [checkedItems]);

  // 3. 計算勾選裝備的「總重量」與「缺漏必備品數量」
  const { totalWeightGrams, checkedCount, missingRequiredCount } = useMemo(() => {
    let weight = 0;
    let count = 0;
    let missingRequired = 0;

    INITIAL_GEAR_DATA.forEach((item) => {
      const isChecked = !!checkedItems[item.id];
      if (isChecked) {
        weight += item.weightGrams;
        count += 1;
      } else if (item.required) {
        missingRequired += 1;
      }
    });

    return {
      totalWeightGrams: weight,
      checkedCount: count,
      missingRequiredCount: missingRequired,
    };
  }, [checkedItems]);

  // 4. 事件處理：單項勾選/取消
  const handleToggleItem = (id) => {
    setCheckedItems((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  // 分類全選 / 全不選
  const handleSelectCategoryAll = (category, isSelectAll) => {
    setCheckedItems((prev) => {
      const updated = { ...prev };
      INITIAL_GEAR_DATA.forEach((item) => {
        if (category === 'All' || item.category === category) {
          updated[item.id] = isSelectAll;
        }
      });
      return updated;
    });
  };

  // 重置所有選取
  const handleReset = () => {
    if (window.confirm('確定要清空所有已勾選的裝備紀錄嗎？')) {
      setCheckedItems({});
    }
  };

  // 依 Tab 篩選當前顯示的裝備
  const categories = ['All', '衣物睡眠', '炊事水具', '電子導航', '安全急救'];
  const displayedGear = useMemo(() => {
    if (activeCategory === 'All') return INITIAL_GEAR_DATA;
    return INITIAL_GEAR_DATA.filter((item) => item.category === activeCategory);
  }, [activeCategory]);

  // 重量單位顯示 (超過 1000 克時轉為 kg)
  const formatWeight = (grams) => {
    if (grams >= 1000) {
      return `${(grams / 1000).toFixed(2)} kg`;
    }
    return `${grams} g`;
  };

  return (
    <div className="guide-container">
      <header className="guide-header">
        <h1>戶外裝備清單與背負重量計算器</h1>
        <p>勾選攜帶的裝備，即時計算裝備總重量並將進度儲存於瀏覽器中。</p>
      </header>

      {/* 數據即時統計看板 */}
      <section className="weight-dashboard">
        <div className="dashboard-card">
          <span className="card-label">背負總重量</span>
          <span className="card-value weight-highlight">{formatWeight(totalWeightGrams)}</span>
        </div>
        <div className="dashboard-card">
          <span className="card-label">已準備項目</span>
          <span className="card-value">
            {checkedCount} / {INITIAL_GEAR_DATA.length}
          </span>
        </div>
        <div className="dashboard-card">
          <span className="card-label">必備裝備狀態</span>
          <span className={`card-value ${missingRequiredCount > 0 ? 'warning-text' : 'success-text'}`}>
            {missingRequiredCount > 0 ? `缺漏 ${missingRequiredCount} 項` : '已齊全'}
          </span>
        </div>
      </section>

      {/* 分類頁籤與快速操作 */}
      <div className="control-bar">
        <div className="category-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`tab-btn ${activeCategory === cat ? 'active' : ''}`}
              onClick={() => setActiveCategory(cat)}
            >
              {cat === 'All' ? '全部裝備' : cat}
            </button>
          ))}
        </div>

        <div className="action-group">
          <button
            className="action-btn"
            onClick={() => handleSelectCategoryAll(activeCategory, true)}
          >
            本區全選
          </button>
          <button
            className="action-btn"
            onClick={() => handleSelectCategoryAll(activeCategory, false)}
          >
            本區取消
          </button>
          <button className="reset-btn-outline" onClick={handleReset}>
            重置紀錄
          </button>
        </div>
      </div>

      {/* 裝備勾選清單 */}
      <section className="gear-list">
        {displayedGear.map((item) => {
          const isChecked = !!checkedItems[item.id];
          return (
            <div
              key={item.id}
              className={`gear-item ${isChecked ? 'checked' : ''}`}
              onClick={() => handleToggleItem(item.id)}
            >
              <div className="checkbox-box">
                <input
                  type="checkbox"
                  id={item.id}
                  checked={isChecked}
                  onChange={() => {}} // 點擊由外層 div 統一處理
                />
              </div>

              <div className="gear-details">
                <label htmlFor={item.id} className="gear-name">
                  {item.name}
                  {item.required && <span className="required-badge">必備</span>}
                </label>
                <span className="category-tag">{item.category}</span>
              </div>

              <div className="gear-weight">{item.weightGrams} g</div>
            </div>
          );
        })}
      </section>
    </div>
  );
}