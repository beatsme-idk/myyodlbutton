import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PaymentPreferences } from '@/types';

export const MyProfilePage = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [preferences, setPreferences] = useState<PaymentPreferences>({
    ensName: 'vitalik.eth',
    address: '0x123...789',
    preferredCurrency: 'USD',
    chainPreferences: {
      eth: { isEnabled: true },
      arb1: { isEnabled: true },
      base: { isEnabled: true },
      pol: { isEnabled: false },
      oeth: { isEnabled: true }
    }
  });
  
  const handleSaveProfile = () => {
    // Handle profile saving logic
    console.log('Saving profile:', preferences);
  };
  
  const handleChainToggle = (chainId: string, isEnabled: boolean) => {
    setPreferences(prev => ({
      ...prev,
      chainPreferences: {
        ...prev.chainPreferences,
        [chainId]: { isEnabled }
      }
    }));
  };
  
  const [settings, setSettings] = useState({
    notifyOnPayment: true,
    displayEnsName: true,
    tokens: ["all"] as string[], // Fixed type error
    chains: ["all"] as string[]  // Fixed type error
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>My Profile</CardTitle>
        <CardDescription>Manage your payment preferences and settings.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>
          <TabsContent value="profile">
            <div className="grid gap-4">
              <div>
                <Label htmlFor="ensName">ENS Name</Label>
                <Input id="ensName" value={preferences.ensName} disabled />
              </div>
              <div>
                <Label htmlFor="address">Wallet Address</Label>
                <Input id="address" value={preferences.address} disabled />
              </div>
              <div>
                <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                <Input id="preferredCurrency" value={preferences.preferredCurrency} disabled />
              </div>
              <div>
                <Label>Chain Preferences</Label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(preferences.chainPreferences).map(([chainId, chain]) => (
                    <div key={chainId} className="flex items-center space-x-2">
                      <Input
                        type="checkbox"
                        id={`chain-${chainId}`}
                        checked={chain.isEnabled}
                        onChange={e => handleChainToggle(chainId, e.target.checked)}
                      />
                      <Label htmlFor={`chain-${chainId}`}>{chainId}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
          <TabsContent value="settings">
            <div className="grid gap-4">
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="notifyOnPayment"
                  checked={settings.notifyOnPayment}
                  onChange={e => setSettings({ ...settings, notifyOnPayment: e.target.checked })}
                />
                <Label htmlFor="notifyOnPayment">Notify on Payment</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Input
                  type="checkbox"
                  id="displayEnsName"
                  checked={settings.displayEnsName}
                  onChange={e => setSettings({ ...settings, displayEnsName: e.target.checked })}
                />
                <Label htmlFor="displayEnsName">Display ENS Name</Label>
              </div>
              <div>
                <Label>Tokens</Label>
                <Input value={settings.tokens.join(', ')} disabled />
              </div>
              <div>
                <Label>Chains</Label>
                <Input value={settings.chains.join(', ')} disabled />
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="justify-between">
        <Button variant="outline">Cancel</Button>
        <Button onClick={handleSaveProfile}>Save Profile</Button>
      </CardFooter>
    </Card>
  );
};

export default MyProfilePage;
