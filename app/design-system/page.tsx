import { Button } from "@/components/ui/Button";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";

export default function DesignSystemPage() {
  return (
    <div className="shochikubai-canvas min-h-screen p-8 md:p-16 space-y-16">
      <section className="shochikubai-panel p-8">
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-white/40 pb-2 tracking-[0.3em]">ボタン</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">基本ボタン (Primary)</Button>
          <Button variant="secondary">副ボタン (Secondary)</Button>
          <Button variant="outline">枠線ボタン (Outline)</Button>
          <Button variant="ghost">幽霊ボタン (Ghost)</Button>
          <Button variant="musubi" size="lg">結び (Musubi)</Button>
        </div>
      </section>

      <section className="shochikubai-panel p-8">
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-white/40 pb-2 tracking-[0.3em]">短冊 (Tanzaku)</h2>
        <div className="flex flex-wrap gap-8 items-start bg-white/40 p-8 rounded-lg overflow-x-auto">
          <Tanzaku content="常磐なる 緑の誓い 松の風" authorName="松" variant="matsu" />
          <Tanzaku content="瑞々しき 音を響かす 竹の道" authorName="竹" variant="take" />
          <Tanzaku content="紅く香る 早春を告げる 梅の雨" authorName="梅" variant="ume" />
        </div>
      </section>

      <section className="shochikubai-panel p-8">
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-white/40 pb-2 tracking-[0.3em]">入力 (Input)</h2>
        <div className="flex justify-center bg-white/50 p-8 rounded-lg">
          <VerticalTextarea 
            placeholder="ここに一句..."
            label="上の句を詠む"
          />
        </div>
      </section>
    </div>
  );
}

