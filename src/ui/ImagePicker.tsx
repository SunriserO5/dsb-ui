import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { avatarAssets } from "../theme/avatarCatalog";

type ImagePickerProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ImagePicker({ label, value, onChange }: ImagePickerProps) {
  const [query, setQuery] = useState("");
  const selected = avatarAssets.find((asset) => asset.url === value);
  const visibleAssets = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return avatarAssets
      .filter((asset) =>
        normalizedQuery ? asset.label.toLowerCase().includes(normalizedQuery) : true,
      )
      .slice(0, 72);
  }, [query]);

  return (
    <div className="image-picker">
      <div className="image-picker-header">
        <span>{label}</span>
        <div className="image-current">
          {value ? <img src={value} alt="" /> : <i />}
          <strong>{selected?.label ?? "未选择"}</strong>
        </div>
      </div>

      <div className="image-search">
        <Search size={15} />
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="搜索头像文件名"
        />
        {value ? (
          <button type="button" onClick={() => onChange("")} aria-label={`清除${label}`}>
            <X size={15} />
          </button>
        ) : null}
      </div>

      <div className="image-grid">
        {visibleAssets.map((asset) => (
          <button
            type="button"
            className={asset.url === value ? "image-choice active" : "image-choice"}
            key={asset.id}
            onClick={() => onChange(asset.url)}
            title={asset.label}
          >
            <img src={asset.url} alt="" />
            <span>{asset.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
