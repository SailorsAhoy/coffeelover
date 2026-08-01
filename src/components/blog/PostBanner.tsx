type Props = {
  imageUrl?: string | null;
  overlayColor?: string;
  overlayOpacity?: number;
  eyebrow?: string | null;
  title: string;
  meta?: React.ReactNode;
  height?: string;
};

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1600&q=80";

const PostBanner = ({
  imageUrl,
  overlayColor = "#3B2717",
  overlayOpacity = 0.4,
  eyebrow,
  title,
  meta,
  height = "h-56 md:h-80",
}: Props) => {
  const opacity = Math.min(0.5, Math.max(0.3, overlayOpacity ?? 0.4));
  return (
    <div className={`relative w-full ${height} overflow-hidden rounded-xl`}>
      <img
        src={imageUrl || DEFAULT_IMAGE}
        alt={title}
        loading="lazy"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0" style={{ backgroundColor: overlayColor, opacity }} />
      <div className="absolute inset-0 flex flex-col justify-end p-5 md:p-8">
        {eyebrow && (
          <span className="mb-2 inline-flex w-fit rounded-full bg-cream/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-cream backdrop-blur-sm">
            {eyebrow}
          </span>
        )}
        <h1 className="font-display text-xl md:text-3xl font-bold text-cream drop-shadow-sm line-clamp-2">{title}</h1>
        {meta && <div className="mt-2 text-sm text-cream/85">{meta}</div>}
      </div>
    </div>
  );
};

export default PostBanner;
