export enum AnalyticEvents {
  /**
   * @description Event when click "View more" in the profile card to view profile details.
   * @param {number} professionalId - Professional ID of the viewed profile
   */
  ASSIGN_CANDIDATES_OPEN_SEE_MORE = 'assign_candidates_open_see_more',

  /**
   * @description Event when click "See curriculum" to view candidate CV in profile details screen.
   * @param {number} professionalId - Professional ID of the viewed profile
   */
  ASSIGN_CANDIDATES_OPEN_SEE_CV = 'assign_candidates_open_see_cv',

  /**
   * @description Event when toggle on "Favorite professional" when assign candidate in shift publishing form.
   * @param {number} professionalId - Professional ID who was toggled on "Favorite professional"
   */
  ASSIGN_CANDIDATES_TOGGLE_ON_FAVORITE_PROFESSIONAL = 'assign_candidates_toggle_on_favorite_professional',

  /**
   * @description Event when toggle off "Favorite professional" when assign candidate in shift publishing form.
   * @param {number} professionalId - Professional ID who was toggled off "Favorite professional"
   */
  ASSIGN_CANDIDATES_TOGGLE_OFF_FAVORITE_PROFESSIONAL = 'assign_candidates_toggle_off_favorite_professional',

  /**
   * @description Event when remove assigned candidate in shift publishing form.
   * @param {number} professionalId - Professional ID who was removed
   */
  ASSIGN_CANDIDATES_DELETE = 'assign_candidates_delete',

  /**
   * @description Event when remove invitation slot in shift editing form.
   * @param {number} professionalId - Professional ID who was removed
   */
  SHIFT_DETAILS_DELETE_INVITATION_SLOT = 'shift_details_delete_invitation_slot',

  /**
   * @description Event when add new invitation slot in shift editing form.
   */
  SHIFT_DETAILS_ADD_INVITATION_SLOT = 'shift_details_add_invitation_slot',

  /**
   * @description Event when toggle on "Favorite professional" when assign candidate in shift publishing form.
   * @param {number} professionalId - Professional ID who was toggled on "Favorite professional"
   */
  SHIFT_DETAILS_TOGGLE_ON_FAVORITE_PROFESSIONAL = 'shift_details_toggle_on_favorite_professional',

  /**
   * @description Event when toggle off "Favorite professional" when assign candidate in shift publishing form.
   * @param {number} professionalId - Professional ID who was toggled off "Favorite professional"
   */
  SHIFT_DETAILS_TOGGLE_OFF_FAVORITE_PROFESSIONAL = 'shift_details_toggle_off_favorite_professional',
}
