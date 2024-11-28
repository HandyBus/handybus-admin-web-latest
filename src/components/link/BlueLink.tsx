import tw from 'tailwind-styled-components';
import Link from 'next/link';

const BlueLink = tw(Link)`
  text-blue-500
  after:content-['↗']
  hover:underline
`;

export default BlueLink;
