import React from 'react';
import Start from './Start';

const StartExamples = () => {
  return (
    <div className="p-8 space-y-8 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-8">Start Component Examples</h1>

      {/* Basic Usage */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">1. Basic Usage (Default)</h2>
        <div className="flex items-center space-x-4">
          <Start />
          <p className="text-gray-600">Default sparkles icon with pulse animation</p>
        </div>
      </section>

      {/* Different Icons */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">2. Different Icons</h2>
        <div className="flex items-center space-x-6">
          <Start icon="star" tooltip="Star icon" />
          <Start icon="heart" tooltip="Heart icon" />
          <Start icon="zap" tooltip="Zap icon" />
          <Start icon="target" tooltip="Target icon" />
          <Start icon="message" tooltip="Message icon" />
        </div>
      </section>

      {/* Different Animations */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">3. Different Animations</h2>
        <div className="flex items-center space-x-6">
          <Start animation="pulse" tooltip="Pulse animation" />
          <Start animation="bounce" tooltip="Bounce animation" />
          <Start animation="rotate" tooltip="Rotate animation" />
          <Start animation="float" tooltip="Float animation" />
          <Start animation="none" tooltip="No animation" />
        </div>
      </section>

      {/* Different Sizes and Colors */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">4. Different Sizes and Colors</h2>
        <div className="flex items-center space-x-6">
          <Start size="w-3 h-3" color="text-red-500" tooltip="Small red" />
          <Start size="w-5 h-5" color="text-blue-500" tooltip="Medium blue" />
          <Start size="w-8 h-8" color="text-green-500" tooltip="Large green" />
          <Start size="w-12 h-12" color="text-purple-500" tooltip="Extra large purple" />
        </div>
      </section>

      {/* Click Handlers */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">5. Click Handlers</h2>
        <div className="flex items-center space-x-6">
          <Start
            onClick={() => alert('Clicked!')}
            tooltip="Click me for alert"
          />
          <Start
            href="/about"
            tooltip="Navigate to about page"
          />
          <Start
            href="https://github.com"
            target="_blank"
            tooltip="Open GitHub in new tab"
          />
        </div>
      </section>

      {/* Tooltip Positions */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">6. Tooltip Positions</h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <Start tooltip="Top tooltip" tooltipPosition="top" />
            <Start tooltip="Bottom tooltip" tooltipPosition="bottom" />
          </div>
          <div className="space-y-4">
            <Start tooltip="Left tooltip" tooltipPosition="left" />
            <Start tooltip="Right tooltip" tooltipPosition="right" />
          </div>
        </div>
      </section>

      {/* Disabled State */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">7. Disabled State</h2>
        <div className="flex items-center space-x-6">
          <Start disabled tooltip="This is disabled" />
          <Start disabled={false} tooltip="This is enabled" />
        </div>
      </section>

      {/* Custom Styling */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">8. Custom Styling</h2>
        <div className="flex items-center space-x-6">
          <Start
            className="p-2 bg-blue-100 rounded-full"
            tooltip="Custom background"
          />
          <Start
            style={{
              background: 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
              padding: '8px',
              borderRadius: '50%'
            }}
            tooltip="Custom gradient style"
          />
        </div>
      </section>

      {/* Real-world Examples */}
      <section className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">9. Real-world Examples</h2>
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <Start
              icon="star"
              color="text-yellow-500"
              animation="bounce"
              onClick={() => { }}
              tooltip="Add to favorites"
            />
            <span>Add to favorites</span>
          </div>

          <div className="flex items-center space-x-4">
            <Start
              icon="heart"
              color="text-red-500"
              animation="pulse"
              onClick={() => { }}
              tooltip="Like this item"
            />
            <span>Like this item</span>
          </div>

          <div className="flex items-center space-x-4">
            <Start
              icon="message"
              color="text-blue-500"
              animation="float"
              href="/contact"
              tooltip="Contact us"
            />
            <span>Contact us</span>
          </div>

          <div className="flex items-center space-x-4">
            <Start
              icon="zap"
              color="text-purple-500"
              animation="rotate"
              onClick={() => { }}
              tooltip="Quick action"
            />
            <span>Quick action</span>
          </div>
        </div>
      </section>
    </div>
  );
};

export default StartExamples;
