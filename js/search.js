/**
 * Client-side full-text search
 * Content index – add/update entries when pages change.
 */
const SEARCH_INDEX = [
  {
    title: "About",
    url: "about.html",
    content: "The Centre for Microbiome Medicine & Immunology (CMMI) is a multidisciplinary research group studying the gut microbiome and its role in human health and disease. Our work spans healthy aging, neurodegenerative disease, inflammatory bowel disease, and more. We integrate multi-omics data — including metagenomics, metatranscriptomics, metabolomics, and proteomics — to build a comprehensive picture of host-microbiome interactions. Members include researchers from UBC's Department of Medicine, the BC Children's Hospital Research Institute, and partner institutions across Canada."
  },
  {
    title: "Current Projects",
    url: "current-projects.html",
    content: "Current research projects. Project Alpha CMMI-001: Gut microbiome dynamics in IBD. Metagenomics metatranscriptomics. Project Beta CMMI-002: Aging microbiome study. Metagenomics metabolomics clinical. Project Gamma CMMI-003: Parkinson's disease gut-brain axis. Metagenomics metatranscriptomics proteomics. Cohort longitudinal study microbiome analysis."
  },
  {
    title: "Sample Overview",
    url: "sample-overview.html",
    content: "Sample overview pilot cohort healthy aging Parkinson's disease stool blood urine metagenomics metatranscriptomics metabolomics proteomics clinical imaging sample size participants"
  },
  {
    title: "Pipelines",
    url: "pipelines.html",
    content: "Bioinformatics pipelines FASTQ quality control adapter trimming host removal alignment assembly taxonomy functional annotation metabolomics proteomics clinical data processing workflow nextflow snakemake"
  },
  {
    title: "Project Alpha – CMMI-001",
    url: "projects/project-alpha.html",
    content: "CMMI-001 gut microbiome IBD inflammatory bowel disease metagenomics metatranscriptomics 16S shotgun sequencing RNA-seq stool samples cohort longitudinal"
  },
  {
    title: "Project Beta – CMMI-002",
    url: "projects/project-beta.html",
    content: "CMMI-002 aging microbiome healthy aging metabolomics metagenomics clinical data plasma blood urine mass spectrometry"
  },
  {
    title: "Project Gamma – CMMI-003",
    url: "projects/project-gamma.html",
    content: "CMMI-003 Parkinson's disease gut-brain axis metagenomics metatranscriptomics proteomics stool plasma neurodegeneration alpha-synuclein microbiome"
  },
  {
    title: "Metagenomics Overview",
    url: "overviews/metagenomics.html",
    content: "Metagenomics shotgun sequencing gut microbiome taxonomy function FASTQ 2x150bp stool DNA abundance phyloseq compositional zero-inflated negative binomial bacteria archaea fungi viral sockeye compute canada paired data metatranscriptomics contact email UBC"
  },
  {
    title: "Metatranscriptomics Overview",
    url: "overviews/metatranscriptomics.html",
    content: "Metatranscriptomics RNA sequencing gene expression active microbiome stool RNA rRNA depletion FASTQ processed tables phyloseq paired metagenomics contact UBC"
  },
  {
    title: "Metabolomics Overview",
    url: "overviews/metabolomics.html",
    content: "Metabolomics metabolite profiling plasma urine stool mass spectrometry LC-MS GC-MS untargeted targeted metabolite tables R analysis contact UBC"
  },
  {
    title: "Proteomics Overview",
    url: "overviews/proteomics.html",
    content: "Proteomics protein profiling stool plasma mass spectrometry DIA quantitative protein tables R analysis contact UBC"
  },
  {
    title: "Metagenomics Tutorial",
    url: "tutorials/metagenomics.html",
    content: "Metagenomics tutorial bioinformatics pipeline quality control fastp host removal bowtie2 MetaPhlAn HUMAnN taxonomy functional annotation step by step guide"
  },
  {
    title: "Metatranscriptomics Tutorial",
    url: "tutorials/metatranscriptomics.html",
    content: "Metatranscriptomics tutorial RNA-seq pipeline rRNA depletion STAR alignment featureCounts gene expression analysis tutorial step by step"
  },
  {
    title: "Metabolomics Tutorial",
    url: "tutorials/metabolomics.html",
    content: "Metabolomics tutorial mass spectrometry data processing XCMS MZmine peak detection alignment normalization R analysis step by step"
  },
  {
    title: "Proteomics Tutorial",
    url: "tutorials/proteomics.html",
    content: "Proteomics tutorial MaxQuant DIA-NN protein identification quantification database search R analysis step by step"
  }
];
const searchInput  = document.getElementById('search-input');
const searchResults = document.getElementById('search-results');
function performSearch() {
  const query = searchInput ? searchInput.value.trim().toLowerCase() : '';
  if (!query || query.length < 2) {
    searchResults.innerHTML = '';
    searchResults.classList.remove('visible');
    return;
  }
  const tokens = query.split(/\s+/).filter(Boolean);
  const scored = SEARCH_INDEX.map(page => {
    const haystack = (page.title + ' ' + page.content).toLowerCase();
    const hits = tokens.filter(t => haystack.includes(t)).length;
    // find first matching snippet
    let snippet = '';
    for (const t of tokens) {
      const idx = haystack.indexOf(t);
      if (idx !== -1) {
        const start = Math.max(0, idx - 40);
        const end   = Math.min(haystack.length, idx + 80);
        snippet = page.content.substring(start, end).trim() + '…';
        break;
      }
    }
    return { ...page, hits, snippet };
  }).filter(p => p.hits > 0).sort((a, b) => b.hits - a.hits);
  if (scored.length === 0) {
    searchResults.innerHTML = '<div class="no-results">No results found.</div>';
    searchResults.classList.add('visible');
    return;
  }
  searchResults.innerHTML = scored.slice(0, 8).map(p => `
    <a class="search-result-item" href="${p.url}">
      <h4>${p.title}</h4>
      <p>${p.snippet || p.content.substring(0, 100) + '…'}</p>
    </a>
  `).join('');
  searchResults.classList.add('visible');
}
// Wire up events
if (searchInput) {
  searchInput.addEventListener('keyup', e => {
    if (e.key === 'Enter') performSearch();
    else if (searchInput.value.trim().length === 0) {
      searchResults.innerHTML = '';
      searchResults.classList.remove('visible');
    }
  });
}
// Hide results when clicking outside
document.addEventListener('click', e => {
  if (searchResults && !searchResults.contains(e.target) && e.target !== searchInput) {
    searchResults.classList.remove('visible');
  }
});
