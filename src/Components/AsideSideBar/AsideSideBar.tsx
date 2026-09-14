import "./AsideSideBar.css"
import type { AdvancedSearchDTO } from "../../Models/dto";

type AsideSideBarProps = {
    filters: AdvancedSearchDTO;
    onFilterChange: (filters: AdvancedSearchDTO) => void;
};

const StarIcon = () => (
  <svg width="12" height="11" viewBox="0 0 12 11" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5.70725 9.13333L2.94058 10.8C2.81836 10.8778 2.69058 10.9111 2.55725 10.9C2.42392 10.8889 2.30725 10.8444 2.20725 10.7667C2.10725 10.6889 2.02947 10.5916 1.97392 10.4747C1.91836 10.3578 1.90725 10.2273 1.94058 10.0833L2.67392 6.93333L0.223917 4.81667C0.112806 4.71667 0.0434728 4.60267 0.0159172 4.47467C-0.0116384 4.34667 -0.00341618 4.22178 0.0405838 4.1C0.0850283 3.97778 0.151695 3.87778 0.240584 3.8C0.329473 3.72222 0.451695 3.67222 0.60725 3.65L3.84058 3.36667L5.09058 0.4C5.14614 0.266667 5.23236 0.166667 5.34925 0.1C5.46614 0.0333334 5.58547 0 5.70725 0C5.82947 0 5.94881 0.0333334 6.06525 0.1C6.18169 0.166667 6.26792 0.266667 6.32392 0.4L7.57392 3.36667L10.8073 3.65C10.9628 3.67222 11.085 3.72222 11.1739 3.8C11.2628 3.87778 11.3295 3.97778 11.3739 4.1C11.4184 4.22222 11.4268 4.34733 11.3993 4.47533C11.3717 4.60333 11.3021 4.71711 11.1906 4.81667L8.74058 6.93333L9.47392 10.0833C9.50725 10.2278 9.49614 10.3584 9.44058 10.4753C9.38503 10.5922 9.30725 10.6893 9.20725 10.7667C9.10725 10.8444 8.99058 10.8889 8.85725 10.9C8.72392 10.9111 8.59614 10.8778 8.47392 10.8L5.70725 9.13333Z"
      fill="#717171"
    />
  </svg>
);
const RATING_OPTIONS = [
  { label: '9+', value: 9, count: 99 },
  { label: '8+', value: 8, count: 124 },
  { label: '7+', value: 7, count: 198 },
  { label: '6+', value: 6, count: 345 },
];
const STARS_OPTIONS = [
  { stars: 5, count: 135 },
  { stars: 4, count: 37 },
  { stars: 3, count: 45 },
  { stars: 2, count: 89 },
  { stars: 1, count: 112 },
];

const AsideSideBar = ({ filters, onFilterChange }: AsideSideBarProps) =>{
    const minPrice = filters.nightPrice ?? 76;
    const rating = filters.rate ?? null;
    const stars = filters.stars ?? null;
    const hasWifi = filters.wifi ?? false;
    return(
        <aside className="sidebar">
            <div className="sidebar_section">
                <h4 className="sidebar_title">Price</h4>
                <div className="price_values">
                    <span>{minPrice}$ night</span>
                    <span>230$ night</span>
                </div>
                <input 
                    type="range" 
                    min="76" 
                    max="230" 
                    value={minPrice} 
                    onChange={(e)=> onFilterChange({ ...filters, nightPrice: Number(e.target.value) })} 
                    className="range_input"/>
            </div>
            <div className="sidebar_section">
                <h4 className="sidebar_title">Rating</h4>
                {RATING_OPTIONS.map((item) => (
                <label key={item.label} className="radio_row">
                    <div className="label_group">
                    <input
                        type="radio"
                        name="rating"
                        value={item.value}
                        checked={rating === item.value}
                        onChange={() => onFilterChange({ ...filters, rate: item.value })}
                    />
                    <span>{item.label}</span>
                    </div>
                    <span className="count">{item.count}</span>
                </label>
                ))}
            </div>
            <div className="sidebar_section">
                <h4 className="sidebar_title">Stars</h4>
                {STARS_OPTIONS.map((item) => (
                <label key={item.stars} className="radio_row">
                    <div className="label_group">
                    <input
                        type="radio"
                        name="stars"
                        value={item.stars}
                        checked={stars === item.stars}
                        onChange={() => onFilterChange({ ...filters, stars: item.stars })}
                    />
                    <span className="stars">{Array.from({ length: item.stars }).map((_, index) => (
                  <StarIcon key={index} />
                ))}</span>
                    </div>
                    <span className="count">{item.count}</span>
                </label>
                ))}
            </div>
            <div className="sidebar_section">
                <h4 className="sidebar_title">Facilities</h4>
                <label className="radio_row">
                <div className="label_group">
                    <input
                    type="checkbox"
                    checked={hasWifi}
                    onChange={(e) => onFilterChange({ ...filters, wifi: e.target.checked })}
                    />
                    <span>Wi-Fi</span>
                </div>
                <span className="count">1135</span>
                </label>
            </div>

        </aside>
    )
}
export default AsideSideBar;
