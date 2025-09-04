import { DEFAULTS } from "@/lib/consts";
import HeaderLayout from "./header-layout";
import { LanguageSwitcher } from "../language-switcher";

export default function AuthHeader() {
    return (
        <HeaderLayout>
            <section className="max-w-7xl mx-auto w-full flex justify-between items-center">
                <h1 className="text-xl font-bold">{DEFAULTS.APP_NAME}</h1>
                <div>
                    <LanguageSwitcher />
                </div>
            </section>
        </HeaderLayout>
    );
}
