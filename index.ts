import {DiscordModules, Injector as InjectorModule, Webpack} from "@Holy";
import config from "./manifest.json";

const {SelectedGuildStore, Constants: {GuildFeatures}, WindowInfoStore} = DiscordModules;
const Injector = InjectorModule.create(config.name);

export default class FixAnimatedGuilds {
    onStart(): void {
        this.patchGuild();
    }

    async patchGuild() {
        const Guild = Webpack.findModule(Webpack.Filters.byProtos("hasFeature", "getIconURL"));

        Injector.inject({
            module: Guild.prototype,
            method: "getIconURL",
            before(_, args) {
                if (this.id !== SelectedGuildStore.getGuildId()) return;
                if (!this.hasFeature(GuildFeatures.ANIMATED_ICON)) return;
                if (!WindowInfoStore.isFocused()) return;

                args[1] = true;
            }
        });
    }

    onStop(): void {
        Injector.uninject();
    }
}