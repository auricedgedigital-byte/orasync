"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import type { ChatConfig } from "./types"

interface ChatSettingsProps {
    config: ChatConfig
    onConfigChange: (newConfig: ChatConfig) => void
}

export function ChatSettings({ config, onConfigChange }: ChatSettingsProps) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Chatbot Configuration</CardTitle>
                <CardDescription>Customize how the AI receptionist appears on your website.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="space-y-2">
                    <Label>Assistant Name</Label>
                    <Input
                        value={config.botName}
                        onChange={(e) => onConfigChange({ ...config, botName: e.target.value })}
                        placeholder="e.g. Front Desk AI"
                    />
                </div>

                <div className="space-y-2">
                    <Label>Brand Color (Hex)</Label>
                    <div className="flex gap-2">
                        <div
                            className="w-10 h-10 rounded border shadow-sm"
                            style={{ backgroundColor: config.primaryColor }}
                        />
                        <Input
                            value={config.primaryColor}
                            onChange={(e) => onConfigChange({ ...config, primaryColor: e.target.value })}
                            placeholder="#000000"
                            className="font-mono"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Welcome Message</Label>
                    <Input
                        value={config.welcomeMessage}
                        onChange={(e) => onConfigChange({ ...config, welcomeMessage: e.target.value })}
                    />
                    <p className="text-xs text-muted-foreground">The first message presented to website visitors.</p>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                        <Label className="text-base">Live Status</Label>
                        <p className="text-sm text-muted-foreground">Enable the widget on your public site</p>
                    </div>
                    <Switch
                        checked={config.isLive}
                        onCheckedChange={(checked) => onConfigChange({ ...config, isLive: checked })}
                    />
                </div>

                <div className="bg-muted p-4 rounded-lg text-xs font-mono break-all">
                    <p className="text-muted-foreground mb-2">// Embed Code</p>
                    {`<script src="https://cdn.orasync.site/widget.js" data-id="your-clinic-id"></script>`}
                </div>
            </CardContent>
        </Card>
    )
}
