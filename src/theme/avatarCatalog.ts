export type AvatarAsset = {
  id: string;
  label: string;
  url: string;
};

const avatarModules = import.meta.glob("../../assets/avatar/*.{png,jpg,jpeg,webp}", {
  eager: true,
  import: "default",
  query: "?url",
}) as Record<string, string>;

export const avatarAssets: AvatarAsset[] = Object.entries(avatarModules)
  .map(([path, url]) => {
    const fileName = path.split("/").pop() ?? path;
    const label = fileName.replace(/\.[^.]+$/, "");
    return {
      id: label,
      label,
      url,
    };
  })
  .sort((a, b) => a.label.localeCompare(b.label));
