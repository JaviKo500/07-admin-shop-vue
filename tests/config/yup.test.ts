import'@/config/yup';
import { localeSpanishText } from '@/config/yup';

import * as yup from 'yup';

describe('Yup.test', () => {
  test( 'Spanish error messages are defined correctly', () => {
    expect(yup.defaultLocale).toEqual({
      ...localeSpanishText,
    });
  });
});