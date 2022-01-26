import * as React from 'react';

import {
  default as TextField,
  TextFieldProps,
} from '@material-ui/core/TextField';

const DEFAULT_EMPTY_VALUE = 0;
const DEFAULT_DECIMAL_PRECISION = 2;
const DEFAULT_DECIMAL_SEPARATOR = '.';
const DEFAULT_THOUSAND_SEPARATOR = ',';

const makeStringValue = (value: number, locale: string | undefined): string =>
  locale ? value.toLocaleString(locale) : value.toString();

const removeThousandSeparator = (
  value: string,
  locale: string | undefined
): string => {
  const separator = getThousandSeparator(locale);
  const parsedSeparator = (separator === '.' ? '\\' : '') + separator;
  const regex = new RegExp(parsedSeparator, 'g');
  return value.replace(regex, '');
};

const getThousandSeparator = (locale: string | undefined): string =>
  locale
    ? (1000).toLocaleString(locale).substring(1, 2)
    : DEFAULT_THOUSAND_SEPARATOR;

const getDecimalSeparator = (locale: string | undefined): string =>
  locale
    ? (1.1).toLocaleString(locale).substring(1, 2)
    : DEFAULT_DECIMAL_SEPARATOR;

export interface IDecimalInputProps
  extends Omit<TextFieldProps, 'onBlur' | 'onChange'> {
  /**
   * The default value to renders. It it is not defined it will be 0.
   */
  defaultValue?: number;
  /**
   * It makes not mandatory the use of a default value.
   */
  disableDefaultValue?: boolean;
  /**
   * The locale that we want to display the number in. This impacts puncuation.
   */
  locale?: string;
  /**
   * The maximum value for the input. If defined, values above maxValue will snap to maxValue.
   */
  maxValue?: number;
  /**
   * The minimum value for the input. If defined, values below minValue will snap to minValue.
   */
  minValue?: number;
  /**
   * The number of digits in the decimal part
   */
  precision?: number;
  /**
   * Callback for when the componenet is blurred
   */
  onBlur?: (value: number | undefined) => void;
  /**
   * Callback for when the value of the component is changed
   */
  onChange?: (value: number) => void;
  /**
   * The value of the input element.
   */
  value?: number;
}

export const DecimalInput: React.FunctionComponent<IDecimalInputProps> = ({
  defaultValue = DEFAULT_EMPTY_VALUE,
  disableDefaultValue = false,
  locale,
  maxValue,
  minValue,
  onBlur,
  onChange,
  precision = DEFAULT_DECIMAL_PRECISION,
  value,
  variant,
  ...IDecimalInputProps
}): React.ReactElement | null => {
  const decimalSeparator = getDecimalSeparator(locale);

  const regex = new RegExp(
    '^-?(\\d)*(\\' + decimalSeparator + ')?([0-9]{0,' + precision + '})?$'
  );
  const [controlledValue, setControlledValue] = React.useState<string>(() =>
    value ? makeStringValue(value, locale) : defaultValue.toString()
  );

  React.useEffect(() => {
    if (value) {
      setControlledValue(makeStringValue(value, locale));
    } else {
      disableDefaultValue
        ? setControlledValue('')
        : setControlledValue(defaultValue.toString());
    }
  }, [setControlledValue, defaultValue, locale, value, disableDefaultValue]);

  const handleOnBlur = (
    event: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    let floatValue: number =
      parseFloat(event.currentTarget.value.replace(/,/g, '.')) || defaultValue;
    if (minValue !== undefined && floatValue < minValue) {
      floatValue = minValue;
    }
    if (maxValue !== undefined && floatValue > maxValue) {
      floatValue = maxValue;
    }

    setControlledValue(makeStringValue(floatValue, locale));
    onBlur &&
      onBlur(disableDefaultValue && floatValue === 0 ? undefined : floatValue);
  };

  const handleOnChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue: string = event.target.value;
    if (regex.test(newValue)) {
      setControlledValue(newValue);
      const value: number = parseFloat(newValue);

      // if it's a NaN will return default value
      if (isNaN(parseFloat(newValue))) {
        onChange && onChange(DEFAULT_EMPTY_VALUE);
        return;
      }

      // avoid triggering onChange callback on typing the decimal separator and trailing zeros following the separator
      if (newValue.indexOf(decimalSeparator) > -1 && value % 1 === 0) {
        return;
      }

      if (
        (minValue === undefined || value >= minValue) &&
        (maxValue === undefined || value <= maxValue)
      ) {
        onChange && onChange(value);
      }
    }
  };

  const handleOnFocus = React.useCallback<() => void>(() => {
    controlledValue === '0'
      ? setControlledValue('')
      : setControlledValue(removeThousandSeparator(controlledValue, locale));
  }, [controlledValue, setControlledValue, locale]);

  return (
    <TextField
      aria-label={'decimal-input'}
      onBlur={handleOnBlur}
      onChange={handleOnChange}
      onFocus={handleOnFocus}
      value={controlledValue}
      variant={variant}
      {...IDecimalInputProps}
    />
  );
};
