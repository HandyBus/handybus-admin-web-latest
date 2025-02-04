import { LoaderCircleIcon } from 'lucide-react';

const Loading = () => {
  return (
    <div className="my-40 flex w-full items-center justify-center">
      <LoaderCircleIcon className="animate-spin" />
    </div>
  );
};

export default Loading;
