import { db } from "@/lib/db"

export type SingularConfig = {
    publicToken: string
    privateToken: string
    streamId: string
}

export const configService = {
    async getSingularConfig(): Promise<SingularConfig> {
        try {
            const config = await db.config.findUnique({
                where: { key: "singular_live" },
            })

            return {
                publicToken: config?.value?.publicToken || "",
                privateToken: config?.value?.privateToken || "",
                streamId: config?.value?.streamId || "",
            }
        } catch (error) {
            console.error("Error retrieving Singular config:", error)
            return {
                publicToken: "",
                privateToken: "",
                streamId: "",
            }
        }
    },

    async saveSingularConfig(data: SingularConfig): Promise<boolean> {
        try {
            const existingConfig = await db.config.findUnique({
                where: { key: "singular_live" },
            })

            if (existingConfig) {
                await db.config.update({
                    where: { key: "singular_live" },
                    data: { value: data },
                })
            } else {
                await db.config.create({
                    data: {
                        key: "singular_live",
                        value: data,
                    },
                })
            }

            return true
        } catch (error) {
            console.error("Error saving Singular config:", error)
            return false
        }
    },
}

