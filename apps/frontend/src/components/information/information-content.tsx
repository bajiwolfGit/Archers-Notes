
interface InformationContentProps {
    section: string;
}

const content: Record<string, {
    title: string;
    paragraphs: string[];
}> = {
    about: {
        title: "About Archer's Notes",
        paragraphs: [
            "Archer's Notes is a student-centered platform designed to make sharing knowledge and study resources easier.",
            "Students can publish notes, explore course-related content, participate in discussions, and collaborate with their academic community.",
            "Our goal is to create an accessible and organized learning environment where students can help one another succeed.",
        ],
    },
    guidelines: {
        title: "Community Guidelines",
        paragraphs: [
            "Be respectful when interacting with other members of the community.",
            "Share relevant and appropriate educational content. Avoid spam, harassment, and misleading information.",
            "Respect intellectual property rights and do not share content that you do not have permission to distribute.",
            "Report inappropriate posts or behavior to help maintain a safe learning environment.",
        ],
    },
    help: {
        title: "Help Center",
        paragraphs: [
            "Welcome to the Archer's Notes Help Center.",
            "You can create notes, save drafts, browse courses, and interact with other students through the platform.",
            "For assistance with your account, posts, or other features, contact the support team.",
        ],
    },
    contact: {
        title: "Contact Us",
        paragraphs: [
            "Have a question, suggestion, or concern about Archer's Notes?",
            "Use the official support channel provided by your institution or the Archer's Notes team.",
        ],
    },
    report: {
        title: "Report an Issue",
        paragraphs: [
            "If you encounter inappropriate content, technical problems, or suspicious activity, please report the issue.",
            "When reporting, provide a clear description of the problem and any relevant details.",
        ],
    },
    privacy: {
        title: "Privacy Policy",
        paragraphs: [
            "Archer's Notes values the privacy and security of its users.",
            "This section will explain what information the platform collects, how that information is used, and how it is protected.",
            "The final privacy policy should be reviewed and approved before the platform is deployed.",
        ],
    },
    terms: {
        title: "Terms of Service",
        paragraphs: [
            "By using Archer's Notes, members agree to follow the platform's rules and applicable policies.",
            "Users are responsible for the content they publish and their interactions with other members.",
            "The final terms of service should be reviewed and approved before the platform is deployed.",
        ],
    },
    guide: {
        title: "Admin Guide",
        paragraphs: [
            "The Admin Dashboard provides tools for managing the Archer's Notes community.",
            "Administrators can review reports, manage users, moderate notes, maintain course directories, and publish announcements.",
            "Use the navigation sidebar to access each administrative feature.",
        ],
    },
    moderation: {
        title: "Moderation Policy",
        paragraphs: [
            "Administrators are responsible for reviewing reported content and maintaining community standards.",
            "Moderation decisions should be consistent, fair, and based on established community guidelines.",
            "Administrators may approve, hide, or remove content according to the platform's moderation procedures.",
            "The final moderation policy should define review criteria, escalation procedures, and appeal processes.",
        ],
    },
};

export default function InformationContent({
    section,
}: InformationContentProps) {
    const selected = content[section];

    if (!selected) {
        return (
            <section className="flex-1 rounded-lg border border-gray-200 bg-white p-6">
                <h2 className="text-lg font-semibold text-[#303a36]">
                    Section Not Found
                </h2>
            </section>
        );
    }

    return (
        <section className="min-w-0 flex-1 rounded-lg border border-gray-200 bg-white p-6 md:p-8">
            <h1 className="mb-5 text-xl font-semibold text-[#303a36]">
                {selected.title}
            </h1>

            <div className="space-y-4">
                {selected.paragraphs.map((paragraph, index) => (
                    <p
                        key={index}
                        className="text-sm leading-7 text-gray-600"
                    >
                        {paragraph}
                    </p>
                ))}
            </div>
        </section>
    );
}
