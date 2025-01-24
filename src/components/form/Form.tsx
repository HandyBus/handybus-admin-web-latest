import { FormHTMLAttributes, PropsWithChildren, ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface Props extends FormHTMLAttributes<HTMLFormElement> {
  children: ReactNode;
  className?: string;
}

const Form = ({ children, className, ...props }: Props) => {
  return (
    <form
      {...props}
      className={twMerge(
        'mx-auto flex w-full max-w-920 flex-col gap-16 rounded-[4px] bg-notion-green px-76 py-32',
        className,
      )}
    >
      {children}
    </form>
  );
};

export default Form;

const Section = ({ children }: PropsWithChildren) => {
  return (
    <section className="flex w-full flex-col gap-12 rounded-[6px] border border-grey-100 bg-white p-24 shadow-sm">
      {children}
    </section>
  );
};

Form.section = Section;

const Label = ({ children }: PropsWithChildren) => {
  return (
    <label className="flex items-center gap-4 text-18 font-500">
      {children}
    </label>
  );
};

Form.label = Label;

const SubmitButton = ({ children }: PropsWithChildren) => {
  return (
    <button
      type="submit"
      className="rounded-lg bg-blue-500 p-8 font-500 text-white hover:bg-blue-600"
    >
      {children}
    </button>
  );
};

Form.submitButton = SubmitButton;
