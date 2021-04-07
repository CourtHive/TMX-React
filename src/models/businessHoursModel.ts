export interface BusinessHoursModel {
  /**
   * Array of integers in 1 - 7 range.
   * 1 - Monday
   * 7 - Sunday
   */
  daysOfWeek: number[];
  /**
   * 24hour start time format (HH:MM)
   */
  startTime: string;
  /**
   * 24hour end time format (HH:MM)
   */
  endTime: string;
}
