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
        'mx-auto flex w-full max-w-[600px] flex-col gap-16 py-32',
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
        'flex w-full flex-col gap-16 rounded-[16px] bg-white p-24 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]',
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
        'flex items-baseline gap-[6px] text-18 font-600',
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
