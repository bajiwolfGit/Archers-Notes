export interface ProfileData {
	name: string;
	email: string;
	subtitle: string;
	bio: string;
	courses: string[];
	avatar: string | null;
	cover: string | null;
}

export const initialProfile: ProfileData = {
	name: "John Doe",
	email: "john.doe@dlsu.edu.ph",
	subtitle: "CCS Student",
	bio: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
	courses: ["CSADPRG", "CSARCH1", "CSNETWK", "DATA103"],
	avatar: null,
	cover: null,
};