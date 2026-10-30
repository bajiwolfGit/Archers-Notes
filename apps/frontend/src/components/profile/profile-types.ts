/**
 * File: components/profile/profile-types.ts
 *
 * Description:
 * Defines the data structure used to represent user profiles
 * in the Archer's Notes application.
 *
 * Also provides initial mock profile information that can
 * be used to populate the current user's profile page.
 *
 * Features:
 * - Defines a reusable TypeScript interface for profile data.
 * - Stores basic user information.
 * - Supports user biographies and enrolled courses.
 * - Supports optional profile and cover images through
 *   nullable image URL fields.
 * - Provides initial mock data for the current user's profile.
 */

/**
 * ProfileData Interface
 *
 * Defines the structure of a user profile.
 *
 * @property name - Full display name of the user.
 * @property email - Email address associated with the user.
 * @property subtitle - Short description displayed below
 *                      the user's name.
 * @property bio - User's biography or personal description.
 * @property courses - Array of course codes associated
 *                     with the user.
 * @property avatar - URL of the user's profile picture.
 *                    A null value indicates no image is set.
 * @property cover - URL of the user's profile cover image.
 *                   A null value indicates no image is set.
 *
 * This interface is exported so it can be reused
 * across profile-related components.
 */
export interface ProfileData {
	name: string;
	email: string;
	subtitle: string;
	bio: string;
	courses: string[];
	avatar: string | null;
	cover: string | null;
}

/**
 * Initial Profile Data
 *
 * Provides predefined profile information for the
 * current user during frontend development.
 *
 * The object follows the ProfileData interface,
 * ensuring that all required fields are present
 * and use the correct data types.
 *
 * Currently contains mock information for John Doe.
 *
 * The avatar and cover properties are initialized
 * as null because no custom images are assigned.
 *
 * This object can be imported by profile-related
 * components to initialize their profile state.
 */
export const initialProfile: ProfileData = {
	name: "John Doe",
	email: "john.doe@dlsu.edu.ph",
	subtitle: "CCS Student",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	courses: ["CSADPRG", "CSARCH1", "CSNETWK", "DATA103"],
	avatar: null,
	cover: null,
};