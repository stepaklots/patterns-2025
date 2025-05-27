import { Row } from '@/week-1/1-oop/lib/row';

export interface Table {
  header(): Row;
  data(): Row[];
}
