import { ImagePlus, X } from "lucide-react";

type ImageUploaderProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
};

export function ImageUploader({ label, value, onChange }: ImageUploaderProps) {
  function handleFile(file: File | undefined) {
    if (!file || !file.type.startsWith("image/")) {
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      if (typeof reader.result === "string") {
        onChange(reader.result);
      }
    });
    reader.readAsDataURL(file);
  }

  return (
    <div className="image-uploader">
      <div className="image-picker-header">
        <span>{label}</span>
        {value ? (
          <button type="button" onClick={() => onChange("")}>
            <X size={15} />
            <span>清除</span>
          </button>
        ) : null}
      </div>

      <label className="upload-drop">
        {value ? <img src={value} alt="" /> : <ImagePlus size={28} />}
        <span>{value ? "点击更换图片" : "点击上传图片"}</span>
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={(event) => handleFile(event.target.files?.[0])}
        />
      </label>
    </div>
  );
}
