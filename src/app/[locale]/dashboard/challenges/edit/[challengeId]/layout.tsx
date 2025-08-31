import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { Locale } from "@/lib/i18n.server";
import PATHS from "@/lib/paths";
import { ChallengeEditStep } from "@/lib/types";
import { Link } from "@radix-ui/react-navigation-menu";

const CHALLENGE_EDIT_PAGES = [
    {
        title: "Challenge",
        href: (challengeId: string, locale: Locale) =>
            PATHS.CHALLENGES.EDIT.STEP(
                challengeId,
                ChallengeEditStep.CHALLENGE,
                locale,
            ),
    },
    {
        title: "Versions",
        href: (challengeId: string, locale: Locale) =>
            PATHS.CHALLENGES.EDIT.STEP(
                challengeId,
                ChallengeEditStep.VERSIONS,
                locale,
            ),
    },
    {
        title: "Tests",
        href: (challengeId: string, locale: Locale) =>
            PATHS.CHALLENGES.EDIT.STEP(
                challengeId,
                ChallengeEditStep.TESTS,
                locale,
            ),
    },
];

export default async function EditChallengeLayout({
    params,
    children,
}: {
    params: Promise<{ challengeId: string; locale: Locale }>;
    children: React.ReactNode;
}) {
    const { challengeId, locale } = await params;

    return (
        <main>
            <NavigationMenu>
                <NavigationMenuList>
                    {CHALLENGE_EDIT_PAGES.map(({ title, href }) => (
                        <NavigationMenuItem key={title}>
                            <NavigationMenuLink asChild>
                                <Link href={href(challengeId, locale)}>
                                    {title}
                                </Link>
                            </NavigationMenuLink>
                        </NavigationMenuItem>
                    ))}
                </NavigationMenuList>
            </NavigationMenu>
            <section>{children}</section>
        </main>
    );
}
