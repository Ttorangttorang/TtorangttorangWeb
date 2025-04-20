import SaveAnnounce from '@/components/announce/Desktop/SaveAnnounce';
import { useUserStore } from '@/store/store';

export default function Announce() {
  const { userAccessToken } = useUserStore();
  return (
    <div className="slider-container">
      <SaveAnnounce userAccessToken={userAccessToken} />
    </div>
  );
}
