import React, { useState } from 'react';
import { Web3Provider } from './context/Web3Context';
import { Navbar, NavTab } from './components/Navbar';
import { Footer } from './components/Footer';
import { Hero } from './components/Hero';
import { CollectionStats } from './components/CollectionStats';
import { FeaturedLegends } from './components/FeaturedLegends';
import { TokenEcosystemSection } from './components/TokenEcosystemSection';
import { RoadmapSection } from './components/RoadmapSection';
import { LiveActivityFeed } from './components/LiveActivityFeed';
import { GenesisMint } from './components/GenesisMint';
import { CollectionExplorer } from './components/CollectionExplorer';
import { TokenomicsView } from './components/TokenomicsView';
import { MinterGiftsView } from './components/MinterGiftsView';
import { MyLegendsView } from './components/MyLegendsView';
import { MarketplaceView } from './components/MarketplaceView';
import { AdminView } from './components/AdminView';
import { WalletModal } from './components/WalletModal';
import { AgentVerifyModal } from './components/AgentVerifyModal';
import { NftDetailModal } from './components/NftDetailModal';
import { AgentEvolutionChamber } from './components/AgentEvolutionChamber';
import { WhaleConfidenceDashboard } from './components/WhaleConfidenceDashboard';
import { MobileStickyMintBar } from './components/MobileStickyMintBar';
import { AgentLegendNFT } from './types';

function MainApp() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [agentModalOpen, setAgentModalOpen] = useState(false);
  const [selectedNft, setSelectedNft] = useState<AgentLegendNFT | null>(null);

  const handleSelectNft = (nft: AgentLegendNFT) => {
    setSelectedNft(nft);
  };

  const navigateToTab = (tab: NavTab) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#080910] text-[#F8F8FF] flex flex-col justify-between selection:bg-[#8957FF]/30 selection:text-white">
      {/* Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={navigateToTab}
        onOpenWalletModal={() => setWalletModalOpen(true)}
        onOpenAgentModal={() => setAgentModalOpen(true)}
      />

      {/* Main View Router with mobile padding */}
      <main className="flex-1 pb-24 md:pb-0">
        {activeTab === 'home' && (
          <>
            <Hero
              onMintClick={() => navigateToTab('genesis')}
              onExploreClick={() => navigateToTab('collection')}
              onEvolutionClick={() => navigateToTab('evolution')}
            />
            <CollectionStats />
            <FeaturedLegends
              onSelectNft={handleSelectNft}
              onViewAllClick={() => navigateToTab('collection')}
            />
            <TokenEcosystemSection
              onLearnMoreClick={() => navigateToTab('tokenomics')}
            />
            <WhaleConfidenceDashboard />
            <RoadmapSection />
            <LiveActivityFeed />
          </>
        )}

        {activeTab === 'genesis' && (
          <GenesisMint
            onOpenAgentModal={() => setAgentModalOpen(true)}
            onOpenWalletModal={() => setWalletModalOpen(true)}
          />
        )}

        {activeTab === 'collection' && (
          <CollectionExplorer onSelectNft={handleSelectNft} />
        )}

        {activeTab === 'evolution' && (
          <AgentEvolutionChamber />
        )}

        {activeTab === 'tokenomics' && (
          <>
            <TokenomicsView />
            <WhaleConfidenceDashboard />
          </>
        )}

        {activeTab === 'gifts' && (
          <MinterGiftsView onGoToMint={() => navigateToTab('genesis')} />
        )}

        {activeTab === 'mylegends' && (
          <MyLegendsView
            onSelectNft={handleSelectNft}
            onGoToMint={() => navigateToTab('genesis')}
            onOpenAgentModal={() => setAgentModalOpen(true)}
          />
        )}

        {activeTab === 'marketplace' && (
          <MarketplaceView onSelectNft={handleSelectNft} />
        )}

        {activeTab === 'activity' && <LiveActivityFeed />}

        {activeTab === 'admin' && <AdminView />}
      </main>

      {/* Floating Sticky Mobile Mint CTA Bar */}
      <MobileStickyMintBar
        onMintClick={() => navigateToTab('genesis')}
        activeTab={activeTab}
      />

      {/* Footer */}
      <Footer />

      {/* Global Modals */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onOpenAgentModal={() => setAgentModalOpen(true)}
      />

      <AgentVerifyModal
        isOpen={agentModalOpen}
        onClose={() => setAgentModalOpen(false)}
      />

      <NftDetailModal
        nft={selectedNft}
        onClose={() => setSelectedNft(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <Web3Provider>
      <MainApp />
    </Web3Provider>
  );
}
