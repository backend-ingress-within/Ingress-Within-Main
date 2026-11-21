import React from 'react';

/**
 * WebMCP (Web Model Context Protocol) Tools Definition & Registration
 * Exposes in-browser capabilities to AI agents via:
 * 1. Imperative API: navigator.modelContext.registerTool() & document.modelContext.registerTool()
 * 2. Declarative API: HTML <form> elements annotated with `toolname` and `tooldescription`
 */

const WEBMCP_TOOLS_SCRIPT = `
(function() {
  var tools = [
    {
      name: "search_care_pathways",
      description: "Explore psychological care pathways on Ingress Within, including self-guided journaling, emotional pattern tracking, and licensed therapist care.",
      inputSchema: {
        type: "object",
        properties: {
          query: {
            type: "string",
            description: "Care topic, mental health goal, or inquiry (e.g. anxiety, burnout, self-guided reflection, therapist care)"
          }
        }
      },
      execute: async function(args) {
        var q = ((args && args.query) || '').toLowerCase();
        var match = 'both';
        if (q.indexOf('journal') !== -1 || q.indexOf('self') !== -1 || q.indexOf('solo') !== -1 || q.indexOf('pattern') !== -1) {
          match = 'self_guided';
        } else if (q.indexOf('therap') !== -1 || q.indexOf('doctor') !== -1 || q.indexOf('clinical') !== -1 || q.indexOf('counsel') !== -1) {
          match = 'therapy';
        }
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                query: args && args.query,
                recommendedPathway: match,
                options: {
                  selfGuided: {
                    title: "Self-Guided Psychological Reflection",
                    description: "Independent structured journaling, emotional pattern recognition, and grounding exercises.",
                    url: "https://ingresswithin.com/start"
                  },
                  therapy: {
                    title: "Professional Telehealth Therapy",
                    description: "1-on-1 consultations with verified licensed clinical psychologists and counselors.",
                    url: "https://ingresswithin.com/therapy"
                  }
                }
              })
            }
          ]
        };
      }
    },
    {
      name: "get_crisis_helplines",
      description: "Retrieve emergency 24/7 mental health crisis and suicide prevention helplines in India.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: async function() {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                country: "India",
                helplines: [
                  { name: "Tele-MANAS (Govt of India)", phone: "14416", available: "24x7", tollFree: true },
                  { name: "KIRAN Mental Health Helpline", phone: "1800-599-0019", available: "24x7", tollFree: true },
                  { name: "Vandrevala Foundation", phone: "9999 666 555", available: "24x7", tollFree: false },
                  { name: "AASRA", phone: "+91 98204 66726", available: "24x7", tollFree: false }
                ]
              })
            }
          ]
        };
      }
    },
    {
      name: "get_business_info",
      description: "Get verified business contact details, operating hours, and location for Ingress Within.",
      inputSchema: {
        type: "object",
        properties: {}
      },
      execute: async function() {
        return {
          content: [
            {
              type: "text",
              text: JSON.stringify({
                name: "Ingress Within",
                email: "contactus@ingresswithin.com",
                phone: "+91 89556 05569",
                address: "Andheri West, Mumbai, Maharashtra 400053, India",
                hours: "Monday to Saturday, 09:00 AM - 09:00 PM IST",
                website: "https://ingresswithin.com"
              })
            }
          ]
        };
      }
    },
    {
      name: "navigate_site",
      description: "Navigate to a designated public section or care portal on Ingress Within.",
      inputSchema: {
        type: "object",
        properties: {
          page: {
            type: "string",
            description: "Page identifier or path (e.g. 'therapy', 'solution', 'pricing', 'about', 'contact', 'privacy-policy')"
          }
        },
        required: ["page"]
      },
      execute: async function(args) {
        var target = (args && args.page) ? (args.page.startsWith('/') ? args.page : '/' + args.page) : '/';
        if (typeof window !== 'undefined') {
          if (window.navigateTo) window.navigateTo(target);
          else window.location.href = target;
        }
        return { content: [{ type: "text", text: "Navigated to " + target }] };
      }
    }
  ];

  function registerAll(ctx) {
    if (!ctx || typeof ctx.registerTool !== 'function') return false;
    try {
      tools.forEach(function(tool) {
        ctx.registerTool(tool);
      });
      return true;
    } catch (e) {
      console.warn('[WebMCP] Tool registration notice:', e);
      return false;
    }
  }

  function registerOnAvailableContexts() {
    var regNav = (typeof navigator !== 'undefined' && navigator.modelContext) ? registerAll(navigator.modelContext) : false;
    var regDoc = (typeof document !== 'undefined' && document.modelContext) ? registerAll(document.modelContext) : false;
    return regNav || regDoc;
  }

  // 1. Initial register attempt on script execution
  registerOnAvailableContexts();

  if (typeof window !== 'undefined') {
    window.__ingress_webmcp_tools = tools;
    window.__ingress_register_webmcp = registerOnAvailableContexts;

    // 2. DOMContentLoaded and window load listeners
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', registerOnAvailableContexts);
    }
    window.addEventListener('load', registerOnAvailableContexts);

    // 3. Dynamic getter/setter watcher if agent injects modelContext post-load
    try {
      if (typeof navigator !== 'undefined' && !('modelContext' in navigator)) {
        var _navCtx = undefined;
        Object.defineProperty(navigator, 'modelContext', {
          configurable: true,
          enumerable: true,
          get: function() { return _navCtx; },
          set: function(v) {
            _navCtx = v;
            if (v) registerAll(v);
          }
        });
      }
    } catch(e) {}

    try {
      if (typeof document !== 'undefined' && !('modelContext' in document)) {
        var _docCtx = undefined;
        Object.defineProperty(document, 'modelContext', {
          configurable: true,
          enumerable: true,
          get: function() { return _docCtx; },
          set: function(v) {
            _docCtx = v;
            if (v) registerAll(v);
          }
        });
      }
    } catch(e) {}
  }
})();
`;

export default function WebMcpTools() {
  return (
    <>
      {/* 1. Imperative WebMCP Registration Script for in-browser agents */}
      <script
        id="webmcp-registration"
        dangerouslySetInnerHTML={{ __html: WEBMCP_TOOLS_SCRIPT }}
      />

      {/* 2. Declarative WebMCP Annotated Forms */}
      <div id="webmcp-declarative-tools" style={{ display: 'none' }} aria-hidden="true">
        <form
          id="webmcp-search-care"
          toolname="search_care_pathways"
          tooldescription="Explore psychological care pathways on Ingress Within including self-guided reflection and licensed therapist matching"
          action="/therapy"
          method="GET"
        >
          <label htmlFor="webmcp-search-query">Query</label>
          <input
            id="webmcp-search-query"
            name="query"
            type="text"
            placeholder="e.g. anxiety, self-guided reflection, therapist care"
            tool-param-description="Care topic, mental health goal, or inquiry keyword"
          />
          <button type="submit">Search Care Pathways</button>
        </form>

        <form
          id="webmcp-contact-support"
          toolname="contact_care_team"
          tooldescription="Submit inquiry or request orientation assistance from the Ingress Within care team"
          action="/contact"
          method="GET"
        >
          <label htmlFor="webmcp-contact-email">Email</label>
          <input
            id="webmcp-contact-email"
            name="email"
            type="email"
            placeholder="you@example.com"
            tool-param-description="User contact email address"
          />
          <label htmlFor="webmcp-contact-message">Message</label>
          <input
            id="webmcp-contact-message"
            name="message"
            type="text"
            placeholder="How can our care team assist you?"
            tool-param-description="Brief description of inquiry or support needed"
          />
          <button type="submit">Contact Care Team</button>
        </form>

        <form
          id="webmcp-crisis-helplines"
          toolname="get_crisis_resources"
          tooldescription="Access emergency 24/7 mental health crisis and suicide prevention helplines in India"
          action="/crisis"
          method="GET"
        >
          <button type="submit">Get Crisis Helplines</button>
        </form>

        <form
          id="webmcp-navigate-site"
          toolname="navigate_site"
          tooldescription="Navigate to a designated public section or care portal on Ingress Within"
          action="/"
          method="GET"
        >
          <label htmlFor="webmcp-nav-page">Page</label>
          <input
            id="webmcp-nav-page"
            name="page"
            type="text"
            placeholder="e.g. therapy, solution, pricing, about, contact"
            tool-param-description="Target page path on Ingress Within"
          />
          <button type="submit">Navigate</button>
        </form>
      </div>
    </>
  );
}
