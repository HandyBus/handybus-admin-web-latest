import {
  ButtonHTMLAttributes,
  FormHTMLAttributes,
  LabelHTMLAttributes,
  PropsWithChildren,
  ReactNode,
} from 'react';
import { customTwMerge } from 'tailwind.config';
import Button from '../button/Button';

interface Form {
  children: ReactNode;
  className?: string;
}

type Props = FormHTMLAttributes<HTMLFormElement> & Form;

const Form = ({ children, className, ...props }: Props) => {
  return (
    <form
      {...props}
      className={customTwMerge(
        'mx-auto flex w-full max-w-[640px] flex-col gap-16 py-32',
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
      className={customTwMerge(
        'flex w-full flex-col gap-16 rounded-[16px] bg-basic-white p-24 shadow-[0_2px_8px_0_rgba(0,0,0,0.08)]',
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
      className={customTwMerge(
        'flex items-baseline gap-[6px] text-18 font-600',
        className,
      )}
    >
      {children}
      {required && <span className="text-basic-red-500">*</span>}
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
    <Button type="submit" size="large" variant="primary" {...props}>
      {children}
    </Button>
  );
};

Form.submitButton = SubmitButton;
