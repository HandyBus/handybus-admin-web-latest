import tw from 'tailwind-styled-components';

const BlueButton = tw.button`
  text-blue-500
  after:content-['↗']
  hover:underline
`;

export default BlueButton;
