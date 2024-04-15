import * as React from 'react'

import { PropertyType } from 'notion-types'

import CheckboxIcon from './type-checkbox'
import DateIcon from './type-date'
import EmailIcon from './type-email'
import FileIcon from './type-file'
import FormulaIcon from './type-formula'
import MultiSelectIcon from './type-multi-select'
import NumberIcon from './type-number'
import PersonIcon from './type-person'
import Person2Icon from './type-person-2'
import PhoneNumberIcon from './type-phone-number'
import RelationIcon from './type-relation'
import SelectIcon from './type-select'
import StatusIcon from './type-status'
import TextIcon from './type-text'
import TimestampIcon from './type-timestamp'
import TitleIcon from './type-title'
import UrlIcon from './type-url'

interface PropertyIconProps {
  className?: string
  type: PropertyType
}

const iconMap = {
  title: TitleIcon,
  text: TextIcon,
  number: NumberIcon,
  select: SelectIcon,
  status: StatusIcon,
  multi_select: MultiSelectIcon,
  date: DateIcon,
  person: PersonIcon,
  file: FileIcon,
  checkbox: CheckboxIcon,
  url: UrlIcon,
  email: EmailIcon,
  phone_number: PhoneNumberIcon,
  formula: FormulaIcon,
  relation: RelationIcon,
  created_time: TimestampIcon,
  last_edited_time: TimestampIcon,
  created_by: Person2Icon,
  last_edited_by: Person2Icon
}

export const PropertyIcon: React.FC<PropertyIconProps> = ({
  type,
  ...rest
}) => {
  const icon = iconMap[type] as any
  if (!icon) return null

  return icon(rest)
}
