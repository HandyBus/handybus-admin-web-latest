import {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { twMerge } from 'tailwind-merge';

interface Form {
  children: ReactNode;
  className?: string;
}

type Props = FormHTMLAttributes<HTMLFormElement> & Form;

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

const Section = ({ children, className }: Form) => {
  return (
    <section
      className={twMerge(
        'flex w-full flex-col gap-12 rounded-[6px] border border-grey-100 bg-white p-24 shadow-sm',
        className,
      )}
    >
      {children}
    </section>
  );
};

Form.section = Section;

interface LabelProps extends LabelHTMLAttributes<HTMLLabelElement> {
  required?: boolean;
}

const Label = ({
  children,
  className,
  required = false,
  ...props
}: LabelProps) => {
  return (
    <label
      {...props}
      className={twMerge(
        'flex items-baseline gap-[6px] text-18 font-500',
        className,
      )}
    >
      {children}
      {required && <span className="text-red-500">*</span>}
    </label>
  );
};

Form.label = Label;

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  disabled?: boolean;
}

const SubmitButton = ({
  children,
  ...props
}: PropsWithChildren<SubmitButtonProps>) => {
  return (
    <button
      type="submit"
      className="flex items-center justify-center gap-8 rounded-lg bg-blue-500 p-8 font-500 text-white hover:bg-blue-600 disabled:cursor-not-allowed disabled:bg-grey-100 disabled:text-grey-500"
      {...props}
    >
      {children}
    </button>
  );
};

Form.submitButton = SubmitButton;
