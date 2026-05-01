import Image from "next/image";
import { ImageOff } from "lucide-react";

export function CardImage({ src, alt }: { src?: string | null; alt: string }) {
  if (!src) {
    return (
      <div className="flex aspect-[4/5] w-full items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 via-orange-50 to-teal-50">
        <div className="flex flex-col items-center gap-2 text-slate-500">
          <ImageOff className="size-8" />
          <p className="text-xs">画像未登録</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl bg-slate-100">
      <Image alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 240px" src={src} />
    </div>
  );
}
