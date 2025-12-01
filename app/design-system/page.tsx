import { Button } from "@/components/ui/Button";
import { Tanzaku } from "@/components/ui/Tanzaku";
import { VerticalTextarea } from "@/components/ui/VerticalTextarea";

export default function DesignSystemPage() {
  return (
    <div className="min-h-screen bg-kinari p-8 md:p-16 space-y-16">
      <section>
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-ai/20 pb-2">ボタン (Buttons)</h2>
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="primary">基本ボタン (Primary)</Button>
          <Button variant="secondary">副ボタン (Secondary)</Button>
          <Button variant="outline">枠線ボタン (Outline)</Button>
          <Button variant="ghost">幽霊ボタン (Ghost)</Button>
          <Button variant="musubi" size="lg">結び (Musubi)</Button>
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-ai/20 pb-2">短冊 (Tanzaku)</h2>
        <div className="flex flex-wrap gap-8 items-start bg-blue-50/50 p-8 rounded-lg overflow-x-auto">
          <Tanzaku content="古池や 蛙飛びこむ 水の音" authorName="芭蕉" variant="kinari" />
          <Tanzaku content="柿くへば 鐘が鳴るなり 法隆寺" authorName="子規" variant="sakura" />
          <Tanzaku content="君待つと 我が恋ひをれば 我が宿の 簾動かし 秋の風吹く" authorName="額田王" variant="mizu" />
          <Tanzaku content="面白い ことを言っても 一人きり" authorName="詠み人知らず" variant="kusa" />
        </div>
      </section>

      <section>
        <h2 className="text-2xl font-bold text-ai mb-8 border-b border-ai/20 pb-2">入力 (Input)</h2>
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

