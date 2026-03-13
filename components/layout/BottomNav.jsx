import Link from 'next/link';
import { useRouter } from 'next/router';

export default function BottomNav({ categories }) {
  const router = useRouter();
  const { categoryId } = router.query;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-100 flex justify-around items-center h-20 pb-4 z-50">
      {categories.map((cat) => {
        const isActive = categoryId === cat.id;
        return (
          <Link key={cat.id} href={`/learn/${cat.id}`} className="flex flex-col items-center flex-1">
            <div className={`text-2xl mb-1 transition-transform ${isActive ? 'scale-125' : 'grayscale opacity-50'}`}>
              {cat.icon}
            </div>
            <span className={`text-[11px] font-black ${isActive ? 'text-blue-500' : 'text-gray-400'}`}>
              {cat.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
