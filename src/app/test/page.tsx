import Heading from '@/components/text/Heading';

const Page = () => {
  return (
    <div>
      <Heading>HELLO</Heading>
      <Heading.h2>HELLO</Heading.h2>
      <Heading.h3>HELLO</Heading.h3>
      <Heading.h4>HELLO</Heading.h4>
      <Heading.h5>HELLO</Heading.h5>
      <Heading backgroundColor="yellow">HELLO</Heading>
      <Heading.h2 backgroundColor="green">HELLO</Heading.h2>
      <Heading.h3 backgroundColor="blue">HELLO</Heading.h3>
      <Heading.h5 backgroundColor="red">HELLO</Heading.h5>
    </div>
  );
};

export default Page;
