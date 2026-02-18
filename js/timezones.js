// Common timezone data with UTC offsets
const TIMEZONES = [
    { id: 'Pacific/Midway', name: 'Midway Island (UTC-11:00)', offset: -11 },
    { id: 'Pacific/Honolulu', name: 'Hawaii (UTC-10:00)', offset: -10 },
    { id: 'Pacific/Tahiti', name: 'Tahiti (UTC-10:00)', offset: -10 },
    { id: 'America/Anchorage', name: 'Alaska (UTC-09:00)', offset: -9 },
    { id: 'America/Los_Angeles', name: 'Pacific Time - Los Angeles (UTC-08:00)', offset: -8 },
    { id: 'America/Phoenix', name: 'Arizona (UTC-07:00)', offset: -7 },
    { id: 'America/Denver', name: 'Mountain Time - Denver (UTC-07:00)', offset: -7 },
    { id: 'America/Chicago', name: 'Central Time - Chicago (UTC-06:00)', offset: -6 },
    { id: 'America/Mexico_City', name: 'Mexico City (UTC-06:00)', offset: -6 },
    { id: 'America/New_York', name: 'Eastern Time - New York (UTC-05:00)', offset: -5 },
    { id: 'America/Bogota', name: 'Bogota, Lima (UTC-05:00)', offset: -5 },
    { id: 'America/Caracas', name: 'Caracas (UTC-04:00)', offset: -4 },
    { id: 'America/Halifax', name: 'Atlantic Time - Halifax (UTC-04:00)', offset: -4 },
    { id: 'America/Santiago', name: 'Santiago (UTC-04:00)', offset: -4 },
    { id: 'America/St_Johns', name: 'Newfoundland (UTC-03:30)', offset: -3.5 },
    { id: 'America/Sao_Paulo', name: 'Sao Paulo (UTC-03:00)', offset: -3 },
    { id: 'America/Argentina/Buenos_Aires', name: 'Buenos Aires (UTC-03:00)', offset: -3 },
    { id: 'Atlantic/South_Georgia', name: 'Mid-Atlantic (UTC-02:00)', offset: -2 },
    { id: 'Atlantic/Azores', name: 'Azores (UTC-01:00)', offset: -1 },
    { id: 'UTC', name: 'UTC (UTC+00:00)', offset: 0 },
    { id: 'Europe/London', name: 'London (UTC+00:00)', offset: 0 },
    { id: 'Atlantic/Reykjavik', name: 'Reykjavik (UTC+00:00)', offset: 0 },
    { id: 'Europe/Paris', name: 'Paris, Berlin (UTC+01:00)', offset: 1 },
    { id: 'Africa/Casablanca', name: 'Casablanca (UTC+01:00)', offset: 1 },
    { id: 'Africa/Lagos', name: 'Lagos (UTC+01:00)', offset: 1 },
    { id: 'Europe/Athens', name: 'Athens, Helsinki (UTC+02:00)', offset: 2 },
    { id: 'Africa/Cairo', name: 'Cairo (UTC+02:00)', offset: 2 },
    { id: 'Africa/Johannesburg', name: 'Johannesburg (UTC+02:00)', offset: 2 },
    { id: 'Europe/Istanbul', name: 'Istanbul (UTC+03:00)', offset: 3 },
    { id: 'Europe/Moscow', name: 'Moscow (UTC+03:00)', offset: 3 },
    { id: 'Africa/Nairobi', name: 'Nairobi (UTC+03:00)', offset: 3 },
    { id: 'Asia/Tehran', name: 'Tehran (UTC+03:30)', offset: 3.5 },
    { id: 'Asia/Dubai', name: 'Dubai (UTC+04:00)', offset: 4 },
    { id: 'Asia/Kabul', name: 'Kabul (UTC+04:30)', offset: 4.5 },
    { id: 'Asia/Karachi', name: 'Karachi (UTC+05:00)', offset: 5 },
    { id: 'Asia/Kolkata', name: 'Mumbai, Delhi (UTC+05:30)', offset: 5.5 },
    { id: 'Asia/Kathmandu', name: 'Kathmandu (UTC+05:45)', offset: 5.75 },
    { id: 'Asia/Dhaka', name: 'Dhaka (UTC+06:00)', offset: 6 },
    { id: 'Asia/Yangon', name: 'Yangon (UTC+06:30)', offset: 6.5 },
    { id: 'Asia/Bangkok', name: 'Bangkok (UTC+07:00)', offset: 7 },
    { id: 'Asia/Jakarta', name: 'Jakarta (UTC+07:00)', offset: 7 },
    { id: 'Asia/Singapore', name: 'Singapore (UTC+08:00)', offset: 8 },
    { id: 'Asia/Hong_Kong', name: 'Hong Kong (UTC+08:00)', offset: 8 },
    { id: 'Asia/Shanghai', name: 'Beijing, Shanghai (UTC+08:00)', offset: 8 },
    { id: 'Australia/Perth', name: 'Perth (UTC+08:00)', offset: 8 },
    { id: 'Asia/Tokyo', name: 'Tokyo (UTC+09:00)', offset: 9 },
    { id: 'Asia/Seoul', name: 'Seoul (UTC+09:00)', offset: 9 },
    { id: 'Australia/Adelaide', name: 'Adelaide (UTC+09:30)', offset: 9.5 },
    { id: 'Australia/Darwin', name: 'Darwin (UTC+09:30)', offset: 9.5 },
    { id: 'Australia/Sydney', name: 'Sydney (UTC+10:00)', offset: 10 },
    { id: 'Australia/Brisbane', name: 'Brisbane (UTC+10:00)', offset: 10 },
    { id: 'Pacific/Noumea', name: 'Noumea (UTC+11:00)', offset: 11 },
    { id: 'Pacific/Auckland', name: 'Auckland (UTC+12:00)', offset: 12 },
    { id: 'Pacific/Fiji', name: 'Fiji (UTC+12:00)', offset: 12 },
];

// Comprehensive airport codes with their timezones (~450 airports)
// Data sourced from IATA/IANA mappings
const AIRPORTS = {
    // ===== UNITED STATES =====

    // -- Northeast --
    'JFK': { name: 'New York JFK', timezone: 'America/New_York', offset: -5 },
    'LGA': { name: 'New York LaGuardia', timezone: 'America/New_York', offset: -5 },
    'EWR': { name: 'Newark Liberty', timezone: 'America/New_York', offset: -5 },
    'BOS': { name: 'Boston Logan', timezone: 'America/New_York', offset: -5 },
    'PHL': { name: 'Philadelphia', timezone: 'America/New_York', offset: -5 },
    'DCA': { name: 'Washington Reagan', timezone: 'America/New_York', offset: -5 },
    'IAD': { name: 'Washington Dulles', timezone: 'America/New_York', offset: -5 },
    'BWI': { name: 'Baltimore/Washington', timezone: 'America/New_York', offset: -5 },
    'PIT': { name: 'Pittsburgh', timezone: 'America/New_York', offset: -5 },
    'BUF': { name: 'Buffalo', timezone: 'America/New_York', offset: -5 },
    'ROC': { name: 'Rochester (NY)', timezone: 'America/New_York', offset: -5 },
    'SYR': { name: 'Syracuse', timezone: 'America/New_York', offset: -5 },
    'ALB': { name: 'Albany (NY)', timezone: 'America/New_York', offset: -5 },
    'BDL': { name: 'Hartford/Springfield', timezone: 'America/New_York', offset: -5 },
    'PVD': { name: 'Providence', timezone: 'America/New_York', offset: -5 },
    'PWM': { name: 'Portland (Maine)', timezone: 'America/New_York', offset: -5 },
    'BTV': { name: 'Burlington (VT)', timezone: 'America/New_York', offset: -5 },
    'HPN': { name: 'Westchester County', timezone: 'America/New_York', offset: -5 },
    'ISP': { name: 'Long Island MacArthur', timezone: 'America/New_York', offset: -5 },
    'ACY': { name: 'Atlantic City', timezone: 'America/New_York', offset: -5 },
    'ACK': { name: 'Nantucket', timezone: 'America/New_York', offset: -5 },
    'MVY': { name: 'Martha\'s Vineyard', timezone: 'America/New_York', offset: -5 },

    // -- Southeast --
    'ATL': { name: 'Atlanta Hartsfield-Jackson', timezone: 'America/New_York', offset: -5 },
    'MIA': { name: 'Miami', timezone: 'America/New_York', offset: -5 },
    'FLL': { name: 'Fort Lauderdale', timezone: 'America/New_York', offset: -5 },
    'MCO': { name: 'Orlando', timezone: 'America/New_York', offset: -5 },
    'TPA': { name: 'Tampa', timezone: 'America/New_York', offset: -5 },
    'CLT': { name: 'Charlotte', timezone: 'America/New_York', offset: -5 },
    'RDU': { name: 'Raleigh-Durham', timezone: 'America/New_York', offset: -5 },
    'JAX': { name: 'Jacksonville', timezone: 'America/New_York', offset: -5 },
    'PBI': { name: 'West Palm Beach', timezone: 'America/New_York', offset: -5 },
    'RSW': { name: 'Fort Myers', timezone: 'America/New_York', offset: -5 },
    'SRQ': { name: 'Sarasota', timezone: 'America/New_York', offset: -5 },
    'EYW': { name: 'Key West', timezone: 'America/New_York', offset: -5 },
    'CHS': { name: 'Charleston (SC)', timezone: 'America/New_York', offset: -5 },
    'SAV': { name: 'Savannah', timezone: 'America/New_York', offset: -5 },
    'RIC': { name: 'Richmond', timezone: 'America/New_York', offset: -5 },
    'ORF': { name: 'Norfolk', timezone: 'America/New_York', offset: -5 },
    'GSP': { name: 'Greenville-Spartanburg', timezone: 'America/New_York', offset: -5 },
    'MYR': { name: 'Myrtle Beach', timezone: 'America/New_York', offset: -5 },
    'GSO': { name: 'Greensboro', timezone: 'America/New_York', offset: -5 },
    'BNA': { name: 'Nashville', timezone: 'America/Chicago', offset: -6 },
    'MEM': { name: 'Memphis', timezone: 'America/Chicago', offset: -6 },
    'PNS': { name: 'Pensacola', timezone: 'America/Chicago', offset: -6 },
    'VPS': { name: 'Destin-Fort Walton', timezone: 'America/Chicago', offset: -6 },
    'BHM': { name: 'Birmingham (AL)', timezone: 'America/Chicago', offset: -6 },
    'HSV': { name: 'Huntsville', timezone: 'America/Chicago', offset: -6 },
    'SDF': { name: 'Louisville', timezone: 'America/Kentucky/Louisville', offset: -5 },
    'LEX': { name: 'Lexington', timezone: 'America/New_York', offset: -5 },

    // -- Midwest --
    'ORD': { name: 'Chicago O\'Hare', timezone: 'America/Chicago', offset: -6 },
    'MDW': { name: 'Chicago Midway', timezone: 'America/Chicago', offset: -6 },
    'DTW': { name: 'Detroit', timezone: 'America/Detroit', offset: -5 },
    'MSP': { name: 'Minneapolis-St. Paul', timezone: 'America/Chicago', offset: -6 },
    'STL': { name: 'St. Louis', timezone: 'America/Chicago', offset: -6 },
    'MKE': { name: 'Milwaukee', timezone: 'America/Chicago', offset: -6 },
    'IND': { name: 'Indianapolis', timezone: 'America/Indiana/Indianapolis', offset: -5 },
    'CMH': { name: 'Columbus (OH)', timezone: 'America/New_York', offset: -5 },
    'CVG': { name: 'Cincinnati', timezone: 'America/New_York', offset: -5 },
    'CLE': { name: 'Cleveland', timezone: 'America/New_York', offset: -5 },
    'MCI': { name: 'Kansas City', timezone: 'America/Chicago', offset: -6 },
    'DSM': { name: 'Des Moines', timezone: 'America/Chicago', offset: -6 },
    'OMA': { name: 'Omaha', timezone: 'America/Chicago', offset: -6 },
    'MSN': { name: 'Madison', timezone: 'America/Chicago', offset: -6 },
    'GRR': { name: 'Grand Rapids', timezone: 'America/Detroit', offset: -5 },
    'FSD': { name: 'Sioux Falls', timezone: 'America/Chicago', offset: -6 },
    'FAR': { name: 'Fargo', timezone: 'America/Chicago', offset: -6 },
    'ICT': { name: 'Wichita', timezone: 'America/Chicago', offset: -6 },

    // -- South Central --
    'DFW': { name: 'Dallas/Fort Worth', timezone: 'America/Chicago', offset: -6 },
    'DAL': { name: 'Dallas Love Field', timezone: 'America/Chicago', offset: -6 },
    'IAH': { name: 'Houston Intercontinental', timezone: 'America/Chicago', offset: -6 },
    'HOU': { name: 'Houston Hobby', timezone: 'America/Chicago', offset: -6 },
    'AUS': { name: 'Austin', timezone: 'America/Chicago', offset: -6 },
    'SAT': { name: 'San Antonio', timezone: 'America/Chicago', offset: -6 },
    'MSY': { name: 'New Orleans', timezone: 'America/Chicago', offset: -6 },
    'OKC': { name: 'Oklahoma City', timezone: 'America/Chicago', offset: -6 },
    'TUL': { name: 'Tulsa', timezone: 'America/Chicago', offset: -6 },
    'LIT': { name: 'Little Rock', timezone: 'America/Chicago', offset: -6 },
    'ELP': { name: 'El Paso', timezone: 'America/Denver', offset: -7 },

    // -- Mountain/West --
    'DEN': { name: 'Denver', timezone: 'America/Denver', offset: -7 },
    'SLC': { name: 'Salt Lake City', timezone: 'America/Denver', offset: -7 },
    'PHX': { name: 'Phoenix', timezone: 'America/Phoenix', offset: -7 },
    'ABQ': { name: 'Albuquerque', timezone: 'America/Denver', offset: -7 },
    'TUS': { name: 'Tucson', timezone: 'America/Phoenix', offset: -7 },
    'BOI': { name: 'Boise', timezone: 'America/Boise', offset: -7 },
    'COS': { name: 'Colorado Springs', timezone: 'America/Denver', offset: -7 },
    'BIL': { name: 'Billings', timezone: 'America/Denver', offset: -7 },
    'BZN': { name: 'Bozeman', timezone: 'America/Denver', offset: -7 },
    'JAC': { name: 'Jackson Hole', timezone: 'America/Denver', offset: -7 },
    'MSO': { name: 'Missoula', timezone: 'America/Denver', offset: -7 },
    'ASE': { name: 'Aspen', timezone: 'America/Denver', offset: -7 },
    'EGE': { name: 'Vail/Eagle County', timezone: 'America/Denver', offset: -7 },
    'HDN': { name: 'Steamboat Springs', timezone: 'America/Denver', offset: -7 },
    'RNO': { name: 'Reno', timezone: 'America/Los_Angeles', offset: -8 },
    'LAS': { name: 'Las Vegas', timezone: 'America/Los_Angeles', offset: -8 },

    // -- Pacific --
    'LAX': { name: 'Los Angeles', timezone: 'America/Los_Angeles', offset: -8 },
    'SFO': { name: 'San Francisco', timezone: 'America/Los_Angeles', offset: -8 },
    'SEA': { name: 'Seattle-Tacoma', timezone: 'America/Los_Angeles', offset: -8 },
    'SAN': { name: 'San Diego', timezone: 'America/Los_Angeles', offset: -8 },
    'PDX': { name: 'Portland (Oregon)', timezone: 'America/Los_Angeles', offset: -8 },
    'OAK': { name: 'Oakland', timezone: 'America/Los_Angeles', offset: -8 },
    'SJC': { name: 'San Jose (CA)', timezone: 'America/Los_Angeles', offset: -8 },
    'SMF': { name: 'Sacramento', timezone: 'America/Los_Angeles', offset: -8 },
    'SNA': { name: 'Orange County (John Wayne)', timezone: 'America/Los_Angeles', offset: -8 },
    'BUR': { name: 'Burbank', timezone: 'America/Los_Angeles', offset: -8 },
    'LGB': { name: 'Long Beach', timezone: 'America/Los_Angeles', offset: -8 },
    'ONT': { name: 'Ontario (CA)', timezone: 'America/Los_Angeles', offset: -8 },
    'PSP': { name: 'Palm Springs', timezone: 'America/Los_Angeles', offset: -8 },
    'FAT': { name: 'Fresno', timezone: 'America/Los_Angeles', offset: -8 },
    'SBA': { name: 'Santa Barbara', timezone: 'America/Los_Angeles', offset: -8 },
    'GEG': { name: 'Spokane', timezone: 'America/Los_Angeles', offset: -8 },
    'EUG': { name: 'Eugene', timezone: 'America/Los_Angeles', offset: -8 },
    'MFR': { name: 'Medford', timezone: 'America/Los_Angeles', offset: -8 },
    'RDM': { name: 'Redmond/Bend', timezone: 'America/Los_Angeles', offset: -8 },
    'BLI': { name: 'Bellingham', timezone: 'America/Los_Angeles', offset: -8 },

    // -- Hawaii --
    'HNL': { name: 'Honolulu', timezone: 'Pacific/Honolulu', offset: -10 },
    'OGG': { name: 'Maui (Kahului)', timezone: 'Pacific/Honolulu', offset: -10 },
    'KOA': { name: 'Kona', timezone: 'Pacific/Honolulu', offset: -10 },
    'LIH': { name: 'Lihue (Kauai)', timezone: 'Pacific/Honolulu', offset: -10 },
    'ITO': { name: 'Hilo', timezone: 'Pacific/Honolulu', offset: -10 },

    // -- Alaska --
    'ANC': { name: 'Anchorage', timezone: 'America/Anchorage', offset: -9 },
    'FAI': { name: 'Fairbanks', timezone: 'America/Anchorage', offset: -9 },
    'JNU': { name: 'Juneau', timezone: 'America/Anchorage', offset: -9 },
    'ADK': { name: 'Adak', timezone: 'America/Adak', offset: -10 },

    // -- US Territories --
    'SJU': { name: 'San Juan (Puerto Rico)', timezone: 'America/Puerto_Rico', offset: -4 },
    'STT': { name: 'St. Thomas (USVI)', timezone: 'America/Puerto_Rico', offset: -4 },
    'STX': { name: 'St. Croix (USVI)', timezone: 'America/Puerto_Rico', offset: -4 },
    'SPN': { name: 'Saipan', timezone: 'Pacific/Guam', offset: 10 },

    // ===== CANADA =====
    'YYZ': { name: 'Toronto Pearson', timezone: 'America/Toronto', offset: -5 },
    'YUL': { name: 'Montreal', timezone: 'America/Toronto', offset: -5 },
    'YVR': { name: 'Vancouver', timezone: 'America/Vancouver', offset: -8 },
    'YYC': { name: 'Calgary', timezone: 'America/Edmonton', offset: -7 },
    'YEG': { name: 'Edmonton', timezone: 'America/Edmonton', offset: -7 },
    'YOW': { name: 'Ottawa', timezone: 'America/Toronto', offset: -5 },
    'YWG': { name: 'Winnipeg', timezone: 'America/Winnipeg', offset: -6 },
    'YHZ': { name: 'Halifax', timezone: 'America/Halifax', offset: -4 },
    'YQB': { name: 'Quebec City', timezone: 'America/Toronto', offset: -5 },
    'YXE': { name: 'Saskatoon', timezone: 'America/Regina', offset: -6 },
    'YQR': { name: 'Regina', timezone: 'America/Regina', offset: -6 },
    'YYJ': { name: 'Victoria', timezone: 'America/Vancouver', offset: -8 },
    'YLW': { name: 'Kelowna', timezone: 'America/Vancouver', offset: -8 },
    'YXU': { name: 'London (Ontario)', timezone: 'America/Toronto', offset: -5 },
    'YYT': { name: 'St. John\'s (NL)', timezone: 'America/St_Johns', offset: -3.5 },
    'YQX': { name: 'Gander', timezone: 'America/St_Johns', offset: -3.5 },
    'YZF': { name: 'Yellowknife', timezone: 'America/Yellowknife', offset: -7 },
    'YXY': { name: 'Whitehorse', timezone: 'America/Whitehorse', offset: -7 },

    // ===== MEXICO =====
    'MEX': { name: 'Mexico City', timezone: 'America/Mexico_City', offset: -6 },
    'CUN': { name: 'Cancun', timezone: 'America/Cancun', offset: -5 },
    'GDL': { name: 'Guadalajara', timezone: 'America/Mexico_City', offset: -6 },
    'MTY': { name: 'Monterrey', timezone: 'America/Monterrey', offset: -6 },
    'SJD': { name: 'San Jose del Cabo', timezone: 'America/Mazatlan', offset: -7 },
    'PVR': { name: 'Puerto Vallarta', timezone: 'America/Mexico_City', offset: -6 },
    'TIJ': { name: 'Tijuana', timezone: 'America/Tijuana', offset: -8 },
    'MZT': { name: 'Mazatlan', timezone: 'America/Mazatlan', offset: -7 },
    'MID': { name: 'Merida', timezone: 'America/Merida', offset: -6 },
    'CZM': { name: 'Cozumel', timezone: 'America/Cancun', offset: -5 },
    'ACA': { name: 'Acapulco', timezone: 'America/Mexico_City', offset: -6 },
    'ZIH': { name: 'Ixtapa/Zihuatanejo', timezone: 'America/Mexico_City', offset: -6 },
    'HUX': { name: 'Huatulco', timezone: 'America/Mexico_City', offset: -6 },
    'AGU': { name: 'Aguascalientes', timezone: 'America/Mexico_City', offset: -6 },
    'OAX': { name: 'Oaxaca', timezone: 'America/Mexico_City', offset: -6 },

    // ===== CARIBBEAN =====
    'NAS': { name: 'Nassau', timezone: 'America/Nassau', offset: -5 },
    'MBJ': { name: 'Montego Bay', timezone: 'America/Jamaica', offset: -5 },
    'KIN': { name: 'Kingston', timezone: 'America/Jamaica', offset: -5 },
    'PUJ': { name: 'Punta Cana', timezone: 'America/Santo_Domingo', offset: -4 },
    'SDQ': { name: 'Santo Domingo', timezone: 'America/Santo_Domingo', offset: -4 },
    'HAV': { name: 'Havana', timezone: 'America/Havana', offset: -5 },
    'AUA': { name: 'Aruba', timezone: 'America/Aruba', offset: -4 },
    'CUR': { name: 'Curacao', timezone: 'America/Curacao', offset: -4 },
    'SXM': { name: 'St. Maarten', timezone: 'America/Lower_Princes', offset: -4 },
    'POS': { name: 'Port of Spain', timezone: 'America/Port_of_Spain', offset: -4 },
    'BGI': { name: 'Barbados', timezone: 'America/Barbados', offset: -4 },
    'GCM': { name: 'Grand Cayman', timezone: 'America/Cayman', offset: -5 },
    'ANU': { name: 'Antigua', timezone: 'America/Antigua', offset: -4 },
    'UVF': { name: 'St. Lucia', timezone: 'America/St_Lucia', offset: -4 },
    'BDA': { name: 'Bermuda', timezone: 'Atlantic/Bermuda', offset: -4 },
    'PAP': { name: 'Port-au-Prince', timezone: 'America/Port-au-Prince', offset: -5 },
    'TAB': { name: 'Tobago', timezone: 'America/Port_of_Spain', offset: -4 },
    'FDF': { name: 'Fort-de-France (Martinique)', timezone: 'America/Martinique', offset: -4 },
    'PTP': { name: 'Pointe-a-Pitre (Guadeloupe)', timezone: 'America/Guadeloupe', offset: -4 },
    'BON': { name: 'Bonaire', timezone: 'America/Kralendijk', offset: -4 },

    // ===== CENTRAL AMERICA =====
    'PTY': { name: 'Panama City', timezone: 'America/Panama', offset: -5 },
    'SJO': { name: 'San Jose (Costa Rica)', timezone: 'America/Costa_Rica', offset: -6 },
    'LIR': { name: 'Liberia (Costa Rica)', timezone: 'America/Costa_Rica', offset: -6 },
    'SAL': { name: 'San Salvador', timezone: 'America/El_Salvador', offset: -6 },
    'GUA': { name: 'Guatemala City', timezone: 'America/Guatemala', offset: -6 },
    'SAP': { name: 'San Pedro Sula', timezone: 'America/Tegucigalpa', offset: -6 },
    'TGU': { name: 'Tegucigalpa', timezone: 'America/Tegucigalpa', offset: -6 },
    'MGA': { name: 'Managua', timezone: 'America/Managua', offset: -6 },
    'BZE': { name: 'Belize City', timezone: 'America/Belize', offset: -6 },
    'RTB': { name: 'Roatan', timezone: 'America/Tegucigalpa', offset: -6 },

    // ===== SOUTH AMERICA =====

    // -- Brazil --
    'GRU': { name: 'Sao Paulo Guarulhos', timezone: 'America/Sao_Paulo', offset: -3 },
    'CGH': { name: 'Sao Paulo Congonhas', timezone: 'America/Sao_Paulo', offset: -3 },
    'GIG': { name: 'Rio de Janeiro Galeao', timezone: 'America/Sao_Paulo', offset: -3 },
    'SDU': { name: 'Rio de Janeiro Santos Dumont', timezone: 'America/Sao_Paulo', offset: -3 },
    'BSB': { name: 'Brasilia', timezone: 'America/Sao_Paulo', offset: -3 },
    'CNF': { name: 'Belo Horizonte', timezone: 'America/Sao_Paulo', offset: -3 },
    'SSA': { name: 'Salvador', timezone: 'America/Bahia', offset: -3 },
    'REC': { name: 'Recife', timezone: 'America/Recife', offset: -3 },
    'FOR': { name: 'Fortaleza', timezone: 'America/Fortaleza', offset: -3 },
    'CWB': { name: 'Curitiba', timezone: 'America/Sao_Paulo', offset: -3 },
    'POA': { name: 'Porto Alegre', timezone: 'America/Sao_Paulo', offset: -3 },
    'MAO': { name: 'Manaus', timezone: 'America/Manaus', offset: -4 },
    'FLN': { name: 'Florianopolis', timezone: 'America/Sao_Paulo', offset: -3 },
    'NAT': { name: 'Natal', timezone: 'America/Fortaleza', offset: -3 },
    'VCP': { name: 'Campinas', timezone: 'America/Sao_Paulo', offset: -3 },
    'BEL': { name: 'Belem', timezone: 'America/Belem', offset: -3 },

    // -- Argentina --
    'EZE': { name: 'Buenos Aires Ezeiza', timezone: 'America/Argentina/Buenos_Aires', offset: -3 },
    'AEP': { name: 'Buenos Aires Aeroparque', timezone: 'America/Argentina/Buenos_Aires', offset: -3 },
    'COR': { name: 'Cordoba (Argentina)', timezone: 'America/Argentina/Cordoba', offset: -3 },
    'MDZ': { name: 'Mendoza', timezone: 'America/Argentina/Mendoza', offset: -3 },
    'BRC': { name: 'Bariloche', timezone: 'America/Argentina/Salta', offset: -3 },
    'IGR': { name: 'Iguazu', timezone: 'America/Argentina/Cordoba', offset: -3 },
    'USH': { name: 'Ushuaia', timezone: 'America/Argentina/Ushuaia', offset: -3 },

    // -- Chile --
    'SCL': { name: 'Santiago', timezone: 'America/Santiago', offset: -4 },
    'IQQ': { name: 'Iquique', timezone: 'America/Santiago', offset: -4 },
    'PMC': { name: 'Puerto Montt', timezone: 'America/Santiago', offset: -4 },
    'PUQ': { name: 'Punta Arenas', timezone: 'America/Punta_Arenas', offset: -3 },
    'IPC': { name: 'Easter Island', timezone: 'Pacific/Easter', offset: -6 },

    // -- Colombia --
    'BOG': { name: 'Bogota', timezone: 'America/Bogota', offset: -5 },
    'MDE': { name: 'Medellin', timezone: 'America/Bogota', offset: -5 },
    'CLO': { name: 'Cali', timezone: 'America/Bogota', offset: -5 },
    'CTG': { name: 'Cartagena', timezone: 'America/Bogota', offset: -5 },
    'BAQ': { name: 'Barranquilla', timezone: 'America/Bogota', offset: -5 },

    // -- Peru --
    'LIM': { name: 'Lima', timezone: 'America/Lima', offset: -5 },
    'CUZ': { name: 'Cusco', timezone: 'America/Lima', offset: -5 },
    'AQP': { name: 'Arequipa', timezone: 'America/Lima', offset: -5 },

    // -- Ecuador --
    'UIO': { name: 'Quito', timezone: 'America/Guayaquil', offset: -5 },
    'GYE': { name: 'Guayaquil', timezone: 'America/Guayaquil', offset: -5 },
    'GPS': { name: 'Galapagos', timezone: 'Pacific/Galapagos', offset: -6 },

    // -- Other South America --
    'CCS': { name: 'Caracas', timezone: 'America/Caracas', offset: -4 },
    'MVD': { name: 'Montevideo', timezone: 'America/Montevideo', offset: -3 },
    'ASU': { name: 'Asuncion', timezone: 'America/Asuncion', offset: -4 },
    'VVI': { name: 'Santa Cruz (Bolivia)', timezone: 'America/La_Paz', offset: -4 },
    'LPB': { name: 'La Paz', timezone: 'America/La_Paz', offset: -4 },
    'GEO': { name: 'Georgetown (Guyana)', timezone: 'America/Guyana', offset: -4 },
    'PBM': { name: 'Paramaribo', timezone: 'America/Paramaribo', offset: -3 },

    // ===== UNITED KINGDOM & IRELAND =====
    'LHR': { name: 'London Heathrow', timezone: 'Europe/London', offset: 0 },
    'LGW': { name: 'London Gatwick', timezone: 'Europe/London', offset: 0 },
    'STN': { name: 'London Stansted', timezone: 'Europe/London', offset: 0 },
    'LTN': { name: 'London Luton', timezone: 'Europe/London', offset: 0 },
    'LCY': { name: 'London City', timezone: 'Europe/London', offset: 0 },
    'MAN': { name: 'Manchester', timezone: 'Europe/London', offset: 0 },
    'EDI': { name: 'Edinburgh', timezone: 'Europe/London', offset: 0 },
    'GLA': { name: 'Glasgow', timezone: 'Europe/London', offset: 0 },
    'BHX': { name: 'Birmingham (UK)', timezone: 'Europe/London', offset: 0 },
    'BRS': { name: 'Bristol', timezone: 'Europe/London', offset: 0 },
    'NCL': { name: 'Newcastle', timezone: 'Europe/London', offset: 0 },
    'LPL': { name: 'Liverpool', timezone: 'Europe/London', offset: 0 },
    'ABZ': { name: 'Aberdeen', timezone: 'Europe/London', offset: 0 },
    'BFS': { name: 'Belfast International', timezone: 'Europe/London', offset: 0 },
    'CWL': { name: 'Cardiff', timezone: 'Europe/London', offset: 0 },
    'DUB': { name: 'Dublin', timezone: 'Europe/Dublin', offset: 0 },
    'SNN': { name: 'Shannon', timezone: 'Europe/Dublin', offset: 0 },
    'ORK': { name: 'Cork', timezone: 'Europe/Dublin', offset: 0 },

    // ===== FRANCE =====
    'CDG': { name: 'Paris Charles de Gaulle', timezone: 'Europe/Paris', offset: 1 },
    'ORY': { name: 'Paris Orly', timezone: 'Europe/Paris', offset: 1 },
    'NCE': { name: 'Nice', timezone: 'Europe/Paris', offset: 1 },
    'LYS': { name: 'Lyon', timezone: 'Europe/Paris', offset: 1 },
    'MRS': { name: 'Marseille', timezone: 'Europe/Paris', offset: 1 },
    'TLS': { name: 'Toulouse', timezone: 'Europe/Paris', offset: 1 },
    'BOD': { name: 'Bordeaux', timezone: 'Europe/Paris', offset: 1 },
    'NTE': { name: 'Nantes', timezone: 'Europe/Paris', offset: 1 },
    'SXB': { name: 'Strasbourg', timezone: 'Europe/Paris', offset: 1 },

    // ===== GERMANY =====
    'FRA': { name: 'Frankfurt', timezone: 'Europe/Berlin', offset: 1 },
    'MUC': { name: 'Munich', timezone: 'Europe/Berlin', offset: 1 },
    'BER': { name: 'Berlin Brandenburg', timezone: 'Europe/Berlin', offset: 1 },
    'DUS': { name: 'Dusseldorf', timezone: 'Europe/Berlin', offset: 1 },
    'HAM': { name: 'Hamburg', timezone: 'Europe/Berlin', offset: 1 },
    'CGN': { name: 'Cologne/Bonn', timezone: 'Europe/Berlin', offset: 1 },
    'STR': { name: 'Stuttgart', timezone: 'Europe/Berlin', offset: 1 },
    'HAJ': { name: 'Hannover', timezone: 'Europe/Berlin', offset: 1 },
    'NUE': { name: 'Nuremberg', timezone: 'Europe/Berlin', offset: 1 },
    'LEJ': { name: 'Leipzig', timezone: 'Europe/Berlin', offset: 1 },
    'DRS': { name: 'Dresden', timezone: 'Europe/Berlin', offset: 1 },

    // ===== SPAIN & PORTUGAL =====
    'MAD': { name: 'Madrid', timezone: 'Europe/Madrid', offset: 1 },
    'BCN': { name: 'Barcelona', timezone: 'Europe/Madrid', offset: 1 },
    'PMI': { name: 'Palma de Mallorca', timezone: 'Europe/Madrid', offset: 1 },
    'AGP': { name: 'Malaga', timezone: 'Europe/Madrid', offset: 1 },
    'ALC': { name: 'Alicante', timezone: 'Europe/Madrid', offset: 1 },
    'VLC': { name: 'Valencia', timezone: 'Europe/Madrid', offset: 1 },
    'SVQ': { name: 'Seville', timezone: 'Europe/Madrid', offset: 1 },
    'BIO': { name: 'Bilbao', timezone: 'Europe/Madrid', offset: 1 },
    'IBZ': { name: 'Ibiza', timezone: 'Europe/Madrid', offset: 1 },
    'TFS': { name: 'Tenerife South', timezone: 'Atlantic/Canary', offset: 0 },
    'LPA': { name: 'Gran Canaria', timezone: 'Atlantic/Canary', offset: 0 },
    'ACE': { name: 'Lanzarote', timezone: 'Atlantic/Canary', offset: 0 },
    'FUE': { name: 'Fuerteventura', timezone: 'Atlantic/Canary', offset: 0 },
    'LIS': { name: 'Lisbon', timezone: 'Europe/Lisbon', offset: 0 },
    'OPO': { name: 'Porto', timezone: 'Europe/Lisbon', offset: 0 },
    'FAO': { name: 'Faro', timezone: 'Europe/Lisbon', offset: 0 },
    'FNC': { name: 'Funchal (Madeira)', timezone: 'Atlantic/Madeira', offset: 0 },
    'PDL': { name: 'Ponta Delgada (Azores)', timezone: 'Atlantic/Azores', offset: -1 },

    // ===== ITALY =====
    'FCO': { name: 'Rome Fiumicino', timezone: 'Europe/Rome', offset: 1 },
    'MXP': { name: 'Milan Malpensa', timezone: 'Europe/Rome', offset: 1 },
    'LIN': { name: 'Milan Linate', timezone: 'Europe/Rome', offset: 1 },
    'VCE': { name: 'Venice', timezone: 'Europe/Rome', offset: 1 },
    'NAP': { name: 'Naples', timezone: 'Europe/Rome', offset: 1 },
    'BLQ': { name: 'Bologna', timezone: 'Europe/Rome', offset: 1 },
    'FLR': { name: 'Florence', timezone: 'Europe/Rome', offset: 1 },
    'PSA': { name: 'Pisa', timezone: 'Europe/Rome', offset: 1 },
    'CTA': { name: 'Catania', timezone: 'Europe/Rome', offset: 1 },
    'PMO': { name: 'Palermo', timezone: 'Europe/Rome', offset: 1 },
    'TRN': { name: 'Turin', timezone: 'Europe/Rome', offset: 1 },
    'BRI': { name: 'Bari', timezone: 'Europe/Rome', offset: 1 },
    'CAG': { name: 'Cagliari', timezone: 'Europe/Rome', offset: 1 },
    'OLB': { name: 'Olbia (Sardinia)', timezone: 'Europe/Rome', offset: 1 },

    // ===== BENELUX & SWITZERLAND & AUSTRIA =====
    'AMS': { name: 'Amsterdam Schiphol', timezone: 'Europe/Amsterdam', offset: 1 },
    'EIN': { name: 'Eindhoven', timezone: 'Europe/Amsterdam', offset: 1 },
    'BRU': { name: 'Brussels', timezone: 'Europe/Brussels', offset: 1 },
    'CRL': { name: 'Brussels Charleroi', timezone: 'Europe/Brussels', offset: 1 },
    'LUX': { name: 'Luxembourg', timezone: 'Europe/Luxembourg', offset: 1 },
    'ZRH': { name: 'Zurich', timezone: 'Europe/Zurich', offset: 1 },
    'GVA': { name: 'Geneva', timezone: 'Europe/Zurich', offset: 1 },
    'BSL': { name: 'Basel', timezone: 'Europe/Zurich', offset: 1 },
    'VIE': { name: 'Vienna', timezone: 'Europe/Vienna', offset: 1 },
    'SZG': { name: 'Salzburg', timezone: 'Europe/Vienna', offset: 1 },
    'INN': { name: 'Innsbruck', timezone: 'Europe/Vienna', offset: 1 },
    'GRZ': { name: 'Graz', timezone: 'Europe/Vienna', offset: 1 },

    // ===== SCANDINAVIA & ICELAND =====
    'CPH': { name: 'Copenhagen', timezone: 'Europe/Copenhagen', offset: 1 },
    'ARN': { name: 'Stockholm Arlanda', timezone: 'Europe/Stockholm', offset: 1 },
    'GOT': { name: 'Gothenburg', timezone: 'Europe/Stockholm', offset: 1 },
    'OSL': { name: 'Oslo', timezone: 'Europe/Oslo', offset: 1 },
    'BGO': { name: 'Bergen', timezone: 'Europe/Oslo', offset: 1 },
    'TRD': { name: 'Trondheim', timezone: 'Europe/Oslo', offset: 1 },
    'SVG': { name: 'Stavanger', timezone: 'Europe/Oslo', offset: 1 },
    'TOS': { name: 'Tromso', timezone: 'Europe/Oslo', offset: 1 },
    'BOO': { name: 'Bodo', timezone: 'Europe/Oslo', offset: 1 },
    'HEL': { name: 'Helsinki', timezone: 'Europe/Helsinki', offset: 2 },
    'TMP': { name: 'Tampere', timezone: 'Europe/Helsinki', offset: 2 },
    'RVN': { name: 'Rovaniemi', timezone: 'Europe/Helsinki', offset: 2 },
    'KEF': { name: 'Reykjavik Keflavik', timezone: 'Atlantic/Reykjavik', offset: 0 },

    // ===== EASTERN EUROPE =====
    'WAW': { name: 'Warsaw', timezone: 'Europe/Warsaw', offset: 1 },
    'KRK': { name: 'Krakow', timezone: 'Europe/Warsaw', offset: 1 },
    'GDN': { name: 'Gdansk', timezone: 'Europe/Warsaw', offset: 1 },
    'WRO': { name: 'Wroclaw', timezone: 'Europe/Warsaw', offset: 1 },
    'PRG': { name: 'Prague', timezone: 'Europe/Prague', offset: 1 },
    'BUD': { name: 'Budapest', timezone: 'Europe/Budapest', offset: 1 },
    'OTP': { name: 'Bucharest', timezone: 'Europe/Bucharest', offset: 2 },
    'CLJ': { name: 'Cluj-Napoca', timezone: 'Europe/Bucharest', offset: 2 },
    'SOF': { name: 'Sofia', timezone: 'Europe/Sofia', offset: 2 },
    'BEG': { name: 'Belgrade', timezone: 'Europe/Belgrade', offset: 1 },
    'ZAG': { name: 'Zagreb', timezone: 'Europe/Zagreb', offset: 1 },
    'SPU': { name: 'Split', timezone: 'Europe/Zagreb', offset: 1 },
    'DBV': { name: 'Dubrovnik', timezone: 'Europe/Zagreb', offset: 1 },
    'LJU': { name: 'Ljubljana', timezone: 'Europe/Ljubljana', offset: 1 },
    'BTS': { name: 'Bratislava', timezone: 'Europe/Bratislava', offset: 1 },
    'TIA': { name: 'Tirana', timezone: 'Europe/Tirane', offset: 1 },
    'SKP': { name: 'Skopje', timezone: 'Europe/Skopje', offset: 1 },
    'SJJ': { name: 'Sarajevo', timezone: 'Europe/Sarajevo', offset: 1 },
    'TGD': { name: 'Podgorica', timezone: 'Europe/Podgorica', offset: 1 },

    // ===== GREECE & CYPRUS =====
    'ATH': { name: 'Athens', timezone: 'Europe/Athens', offset: 2 },
    'SKG': { name: 'Thessaloniki', timezone: 'Europe/Athens', offset: 2 },
    'HER': { name: 'Heraklion (Crete)', timezone: 'Europe/Athens', offset: 2 },
    'CHQ': { name: 'Chania (Crete)', timezone: 'Europe/Athens', offset: 2 },
    'RHO': { name: 'Rhodes', timezone: 'Europe/Athens', offset: 2 },
    'CFU': { name: 'Corfu', timezone: 'Europe/Athens', offset: 2 },
    'JTR': { name: 'Santorini', timezone: 'Europe/Athens', offset: 2 },
    'JMK': { name: 'Mykonos', timezone: 'Europe/Athens', offset: 2 },
    'KGS': { name: 'Kos', timezone: 'Europe/Athens', offset: 2 },
    'ZTH': { name: 'Zakynthos', timezone: 'Europe/Athens', offset: 2 },
    'LCA': { name: 'Larnaca', timezone: 'Asia/Nicosia', offset: 2 },
    'PFO': { name: 'Paphos', timezone: 'Asia/Nicosia', offset: 2 },

    // ===== TURKEY =====
    'IST': { name: 'Istanbul', timezone: 'Europe/Istanbul', offset: 3 },
    'SAW': { name: 'Istanbul Sabiha Gokcen', timezone: 'Europe/Istanbul', offset: 3 },
    'ESB': { name: 'Ankara Esenboga', timezone: 'Europe/Istanbul', offset: 3 },
    'AYT': { name: 'Antalya', timezone: 'Europe/Istanbul', offset: 3 },
    'DLM': { name: 'Dalaman', timezone: 'Europe/Istanbul', offset: 3 },
    'BJV': { name: 'Bodrum', timezone: 'Europe/Istanbul', offset: 3 },
    'ADB': { name: 'Izmir', timezone: 'Europe/Istanbul', offset: 3 },
    'TZX': { name: 'Trabzon', timezone: 'Europe/Istanbul', offset: 3 },

    // ===== RUSSIA =====
    'SVO': { name: 'Moscow Sheremetyevo', timezone: 'Europe/Moscow', offset: 3 },
    'DME': { name: 'Moscow Domodedovo', timezone: 'Europe/Moscow', offset: 3 },
    'VKO': { name: 'Moscow Vnukovo', timezone: 'Europe/Moscow', offset: 3 },
    'LED': { name: 'St. Petersburg', timezone: 'Europe/Moscow', offset: 3 },
    'AER': { name: 'Sochi', timezone: 'Europe/Moscow', offset: 3 },
    'KZN': { name: 'Kazan', timezone: 'Europe/Moscow', offset: 3 },
    'SVX': { name: 'Yekaterinburg', timezone: 'Asia/Yekaterinburg', offset: 5 },
    'OVB': { name: 'Novosibirsk', timezone: 'Asia/Novosibirsk', offset: 7 },
    'KJA': { name: 'Krasnoyarsk', timezone: 'Asia/Krasnoyarsk', offset: 7 },
    'IKT': { name: 'Irkutsk', timezone: 'Asia/Irkutsk', offset: 8 },
    'VVO': { name: 'Vladivostok', timezone: 'Asia/Vladivostok', offset: 10 },
    'KHV': { name: 'Khabarovsk', timezone: 'Asia/Vladivostok', offset: 10 },
    'PKC': { name: 'Petropavlovsk-Kamchatsky', timezone: 'Asia/Kamchatka', offset: 12 },

    // ===== BALTIC STATES =====
    'TLL': { name: 'Tallinn', timezone: 'Europe/Tallinn', offset: 2 },
    'RIX': { name: 'Riga', timezone: 'Europe/Riga', offset: 2 },
    'VNO': { name: 'Vilnius', timezone: 'Europe/Vilnius', offset: 2 },

    // ===== UKRAINE / CAUCASUS =====
    'KBP': { name: 'Kyiv Boryspil', timezone: 'Europe/Kiev', offset: 2 },
    'ODS': { name: 'Odesa', timezone: 'Europe/Kiev', offset: 2 },
    'TBS': { name: 'Tbilisi', timezone: 'Asia/Tbilisi', offset: 4 },
    'BUS': { name: 'Batumi', timezone: 'Asia/Tbilisi', offset: 4 },
    'EVN': { name: 'Yerevan', timezone: 'Asia/Yerevan', offset: 4 },
    'GYD': { name: 'Baku', timezone: 'Asia/Baku', offset: 4 },

    // ===== MALTA =====
    'MLA': { name: 'Malta', timezone: 'Europe/Malta', offset: 1 },

    // ===== MIDDLE EAST =====
    'DXB': { name: 'Dubai', timezone: 'Asia/Dubai', offset: 4 },
    'AUH': { name: 'Abu Dhabi', timezone: 'Asia/Dubai', offset: 4 },
    'SHJ': { name: 'Sharjah', timezone: 'Asia/Dubai', offset: 4 },
    'DOH': { name: 'Doha', timezone: 'Asia/Qatar', offset: 3 },
    'BAH': { name: 'Bahrain', timezone: 'Asia/Bahrain', offset: 3 },
    'KWI': { name: 'Kuwait City', timezone: 'Asia/Kuwait', offset: 3 },
    'MCT': { name: 'Muscat', timezone: 'Asia/Muscat', offset: 4 },
    'RUH': { name: 'Riyadh', timezone: 'Asia/Riyadh', offset: 3 },
    'JED': { name: 'Jeddah', timezone: 'Asia/Riyadh', offset: 3 },
    'DMM': { name: 'Dammam', timezone: 'Asia/Riyadh', offset: 3 },
    'MED': { name: 'Medina', timezone: 'Asia/Riyadh', offset: 3 },
    'TLV': { name: 'Tel Aviv', timezone: 'Asia/Jerusalem', offset: 2 },
    'AMM': { name: 'Amman', timezone: 'Asia/Amman', offset: 2 },
    'BEY': { name: 'Beirut', timezone: 'Asia/Beirut', offset: 2 },
    'BGW': { name: 'Baghdad', timezone: 'Asia/Baghdad', offset: 3 },
    'EBL': { name: 'Erbil', timezone: 'Asia/Baghdad', offset: 3 },
    'IKA': { name: 'Tehran Imam Khomeini', timezone: 'Asia/Tehran', offset: 3.5 },
    'MHD': { name: 'Mashhad', timezone: 'Asia/Tehran', offset: 3.5 },

    // ===== SOUTH ASIA =====
    'DEL': { name: 'Delhi', timezone: 'Asia/Kolkata', offset: 5.5 },
    'BOM': { name: 'Mumbai', timezone: 'Asia/Kolkata', offset: 5.5 },
    'BLR': { name: 'Bangalore', timezone: 'Asia/Kolkata', offset: 5.5 },
    'MAA': { name: 'Chennai', timezone: 'Asia/Kolkata', offset: 5.5 },
    'CCU': { name: 'Kolkata', timezone: 'Asia/Kolkata', offset: 5.5 },
    'HYD': { name: 'Hyderabad', timezone: 'Asia/Kolkata', offset: 5.5 },
    'COK': { name: 'Kochi', timezone: 'Asia/Kolkata', offset: 5.5 },
    'GOI': { name: 'Goa', timezone: 'Asia/Kolkata', offset: 5.5 },
    'AMD': { name: 'Ahmedabad', timezone: 'Asia/Kolkata', offset: 5.5 },
    'PNQ': { name: 'Pune', timezone: 'Asia/Kolkata', offset: 5.5 },
    'JAI': { name: 'Jaipur', timezone: 'Asia/Kolkata', offset: 5.5 },
    'TRV': { name: 'Thiruvananthapuram', timezone: 'Asia/Kolkata', offset: 5.5 },
    'GAU': { name: 'Guwahati', timezone: 'Asia/Kolkata', offset: 5.5 },
    'IXC': { name: 'Chandigarh', timezone: 'Asia/Kolkata', offset: 5.5 },
    'LKO': { name: 'Lucknow', timezone: 'Asia/Kolkata', offset: 5.5 },
    'VNS': { name: 'Varanasi', timezone: 'Asia/Kolkata', offset: 5.5 },
    'CMB': { name: 'Colombo', timezone: 'Asia/Colombo', offset: 5.5 },
    'MLE': { name: 'Male (Maldives)', timezone: 'Indian/Maldives', offset: 5 },
    'KTM': { name: 'Kathmandu', timezone: 'Asia/Kathmandu', offset: 5.75 },
    'DAC': { name: 'Dhaka', timezone: 'Asia/Dhaka', offset: 6 },
    'ISB': { name: 'Islamabad', timezone: 'Asia/Karachi', offset: 5 },
    'KHI': { name: 'Karachi', timezone: 'Asia/Karachi', offset: 5 },
    'LHE': { name: 'Lahore', timezone: 'Asia/Karachi', offset: 5 },
    'KBL': { name: 'Kabul', timezone: 'Asia/Kabul', offset: 4.5 },

    // ===== SOUTHEAST ASIA =====
    'SIN': { name: 'Singapore Changi', timezone: 'Asia/Singapore', offset: 8 },
    'BKK': { name: 'Bangkok Suvarnabhumi', timezone: 'Asia/Bangkok', offset: 7 },
    'DMK': { name: 'Bangkok Don Mueang', timezone: 'Asia/Bangkok', offset: 7 },
    'HKT': { name: 'Phuket', timezone: 'Asia/Bangkok', offset: 7 },
    'CNX': { name: 'Chiang Mai', timezone: 'Asia/Bangkok', offset: 7 },
    'USM': { name: 'Ko Samui', timezone: 'Asia/Bangkok', offset: 7 },
    'KUL': { name: 'Kuala Lumpur', timezone: 'Asia/Kuala_Lumpur', offset: 8 },
    'PEN': { name: 'Penang', timezone: 'Asia/Kuala_Lumpur', offset: 8 },
    'BKI': { name: 'Kota Kinabalu', timezone: 'Asia/Kuala_Lumpur', offset: 8 },
    'KCH': { name: 'Kuching', timezone: 'Asia/Kuching', offset: 8 },
    'LGK': { name: 'Langkawi', timezone: 'Asia/Kuala_Lumpur', offset: 8 },
    'CGK': { name: 'Jakarta', timezone: 'Asia/Jakarta', offset: 7 },
    'DPS': { name: 'Bali (Denpasar)', timezone: 'Asia/Makassar', offset: 8 },
    'SUB': { name: 'Surabaya', timezone: 'Asia/Jakarta', offset: 7 },
    'UPG': { name: 'Makassar', timezone: 'Asia/Makassar', offset: 8 },
    'JOG': { name: 'Yogyakarta', timezone: 'Asia/Jakarta', offset: 7 },
    'KNO': { name: 'Medan', timezone: 'Asia/Jakarta', offset: 7 },
    'MNL': { name: 'Manila', timezone: 'Asia/Manila', offset: 8 },
    'CEB': { name: 'Cebu', timezone: 'Asia/Manila', offset: 8 },
    'SGN': { name: 'Ho Chi Minh City', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
    'HAN': { name: 'Hanoi', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
    'DAD': { name: 'Da Nang', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
    'PQC': { name: 'Phu Quoc', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
    'CXR': { name: 'Nha Trang (Cam Ranh)', timezone: 'Asia/Ho_Chi_Minh', offset: 7 },
    'PNH': { name: 'Phnom Penh', timezone: 'Asia/Phnom_Penh', offset: 7 },
    'REP': { name: 'Siem Reap', timezone: 'Asia/Phnom_Penh', offset: 7 },
    'VTE': { name: 'Vientiane', timezone: 'Asia/Vientiane', offset: 7 },
    'LPQ': { name: 'Luang Prabang', timezone: 'Asia/Vientiane', offset: 7 },
    'RGN': { name: 'Yangon', timezone: 'Asia/Yangon', offset: 6.5 },
    'MDL': { name: 'Mandalay', timezone: 'Asia/Yangon', offset: 6.5 },
    'BWN': { name: 'Bandar Seri Begawan', timezone: 'Asia/Brunei', offset: 8 },

    // ===== EAST ASIA - CHINA =====
    'PEK': { name: 'Beijing Capital', timezone: 'Asia/Shanghai', offset: 8 },
    'PKX': { name: 'Beijing Daxing', timezone: 'Asia/Shanghai', offset: 8 },
    'PVG': { name: 'Shanghai Pudong', timezone: 'Asia/Shanghai', offset: 8 },
    'SHA': { name: 'Shanghai Hongqiao', timezone: 'Asia/Shanghai', offset: 8 },
    'CAN': { name: 'Guangzhou', timezone: 'Asia/Shanghai', offset: 8 },
    'SZX': { name: 'Shenzhen', timezone: 'Asia/Shanghai', offset: 8 },
    'CTU': { name: 'Chengdu', timezone: 'Asia/Shanghai', offset: 8 },
    'CKG': { name: 'Chongqing', timezone: 'Asia/Shanghai', offset: 8 },
    'KMG': { name: 'Kunming', timezone: 'Asia/Shanghai', offset: 8 },
    'XIY': { name: 'Xi\'an', timezone: 'Asia/Shanghai', offset: 8 },
    'HGH': { name: 'Hangzhou', timezone: 'Asia/Shanghai', offset: 8 },
    'NKG': { name: 'Nanjing', timezone: 'Asia/Shanghai', offset: 8 },
    'WUH': { name: 'Wuhan', timezone: 'Asia/Shanghai', offset: 8 },
    'TSN': { name: 'Tianjin', timezone: 'Asia/Shanghai', offset: 8 },
    'TAO': { name: 'Qingdao', timezone: 'Asia/Shanghai', offset: 8 },
    'DLC': { name: 'Dalian', timezone: 'Asia/Shanghai', offset: 8 },
    'SHE': { name: 'Shenyang', timezone: 'Asia/Shanghai', offset: 8 },
    'HRB': { name: 'Harbin', timezone: 'Asia/Shanghai', offset: 8 },
    'CSX': { name: 'Changsha', timezone: 'Asia/Shanghai', offset: 8 },
    'XMN': { name: 'Xiamen', timezone: 'Asia/Shanghai', offset: 8 },
    'FOC': { name: 'Fuzhou', timezone: 'Asia/Shanghai', offset: 8 },
    'HAK': { name: 'Haikou', timezone: 'Asia/Shanghai', offset: 8 },
    'SYX': { name: 'Sanya', timezone: 'Asia/Shanghai', offset: 8 },
    'URC': { name: 'Urumqi', timezone: 'Asia/Urumqi', offset: 6 },
    'LXA': { name: 'Lhasa', timezone: 'Asia/Shanghai', offset: 8 },
    'KWL': { name: 'Guilin', timezone: 'Asia/Shanghai', offset: 8 },
    'KWE': { name: 'Guiyang', timezone: 'Asia/Shanghai', offset: 8 },
    'NNG': { name: 'Nanning', timezone: 'Asia/Shanghai', offset: 8 },

    // ===== EAST ASIA - HONG KONG / MACAU / TAIWAN =====
    'HKG': { name: 'Hong Kong', timezone: 'Asia/Hong_Kong', offset: 8 },
    'MFM': { name: 'Macau', timezone: 'Asia/Macau', offset: 8 },
    'TPE': { name: 'Taipei Taoyuan', timezone: 'Asia/Taipei', offset: 8 },
    'TSA': { name: 'Taipei Songshan', timezone: 'Asia/Taipei', offset: 8 },
    'KHH': { name: 'Kaohsiung', timezone: 'Asia/Taipei', offset: 8 },
    'RMQ': { name: 'Taichung', timezone: 'Asia/Taipei', offset: 8 },

    // ===== JAPAN =====
    'NRT': { name: 'Tokyo Narita', timezone: 'Asia/Tokyo', offset: 9 },
    'HND': { name: 'Tokyo Haneda', timezone: 'Asia/Tokyo', offset: 9 },
    'KIX': { name: 'Osaka Kansai', timezone: 'Asia/Tokyo', offset: 9 },
    'ITM': { name: 'Osaka Itami', timezone: 'Asia/Tokyo', offset: 9 },
    'NGO': { name: 'Nagoya Chubu', timezone: 'Asia/Tokyo', offset: 9 },
    'FUK': { name: 'Fukuoka', timezone: 'Asia/Tokyo', offset: 9 },
    'CTS': { name: 'Sapporo (New Chitose)', timezone: 'Asia/Tokyo', offset: 9 },
    'OKA': { name: 'Okinawa (Naha)', timezone: 'Asia/Tokyo', offset: 9 },
    'KOJ': { name: 'Kagoshima', timezone: 'Asia/Tokyo', offset: 9 },
    'HIJ': { name: 'Hiroshima', timezone: 'Asia/Tokyo', offset: 9 },
    'SDJ': { name: 'Sendai', timezone: 'Asia/Tokyo', offset: 9 },
    'KMQ': { name: 'Komatsu (Kanazawa)', timezone: 'Asia/Tokyo', offset: 9 },
    'TAK': { name: 'Takamatsu', timezone: 'Asia/Tokyo', offset: 9 },
    'MYJ': { name: 'Matsuyama', timezone: 'Asia/Tokyo', offset: 9 },
    'KMJ': { name: 'Kumamoto', timezone: 'Asia/Tokyo', offset: 9 },
    'NGS': { name: 'Nagasaki', timezone: 'Asia/Tokyo', offset: 9 },
    'AOJ': { name: 'Aomori', timezone: 'Asia/Tokyo', offset: 9 },
    'AKJ': { name: 'Asahikawa', timezone: 'Asia/Tokyo', offset: 9 },
    'OBO': { name: 'Obihiro (Tokachi)', timezone: 'Asia/Tokyo', offset: 9 },
    'MMB': { name: 'Memanbetsu (Abashiri)', timezone: 'Asia/Tokyo', offset: 9 },
    'ISG': { name: 'Ishigaki', timezone: 'Asia/Tokyo', offset: 9 },
    'MMY': { name: 'Miyako', timezone: 'Asia/Tokyo', offset: 9 },
    'GAJ': { name: 'Yamagata', timezone: 'Asia/Tokyo', offset: 9 },
    'KCZ': { name: 'Kochi', timezone: 'Asia/Tokyo', offset: 9 },
    'TOY': { name: 'Toyama', timezone: 'Asia/Tokyo', offset: 9 },
    'OIT': { name: 'Oita', timezone: 'Asia/Tokyo', offset: 9 },

    // ===== KOREA =====
    'ICN': { name: 'Seoul Incheon', timezone: 'Asia/Seoul', offset: 9 },
    'GMP': { name: 'Seoul Gimpo', timezone: 'Asia/Seoul', offset: 9 },
    'PUS': { name: 'Busan', timezone: 'Asia/Seoul', offset: 9 },
    'CJU': { name: 'Jeju', timezone: 'Asia/Seoul', offset: 9 },
    'TAE': { name: 'Daegu', timezone: 'Asia/Seoul', offset: 9 },

    // ===== MONGOLIA =====
    'UBN': { name: 'Ulaanbaatar', timezone: 'Asia/Ulaanbaatar', offset: 8 },

    // ===== CENTRAL ASIA =====
    'NQZ': { name: 'Astana', timezone: 'Asia/Almaty', offset: 6 },
    'ALA': { name: 'Almaty', timezone: 'Asia/Almaty', offset: 6 },
    'TAS': { name: 'Tashkent', timezone: 'Asia/Tashkent', offset: 5 },
    'FRU': { name: 'Bishkek (Manas)', timezone: 'Asia/Bishkek', offset: 6 },
    'DYU': { name: 'Dushanbe', timezone: 'Asia/Dushanbe', offset: 5 },
    'ASB': { name: 'Ashgabat', timezone: 'Asia/Ashgabat', offset: 5 },

    // ===== AFRICA =====

    // -- North Africa --
    'CAI': { name: 'Cairo', timezone: 'Africa/Cairo', offset: 2 },
    'HRG': { name: 'Hurghada', timezone: 'Africa/Cairo', offset: 2 },
    'SSH': { name: 'Sharm El Sheikh', timezone: 'Africa/Cairo', offset: 2 },
    'LXR': { name: 'Luxor', timezone: 'Africa/Cairo', offset: 2 },
    'CMN': { name: 'Casablanca', timezone: 'Africa/Casablanca', offset: 1 },
    'RAK': { name: 'Marrakech', timezone: 'Africa/Casablanca', offset: 1 },
    'TNG': { name: 'Tangier', timezone: 'Africa/Casablanca', offset: 1 },
    'FEZ': { name: 'Fez', timezone: 'Africa/Casablanca', offset: 1 },
    'AGA': { name: 'Agadir', timezone: 'Africa/Casablanca', offset: 1 },
    'TUN': { name: 'Tunis', timezone: 'Africa/Tunis', offset: 1 },
    'ALG': { name: 'Algiers', timezone: 'Africa/Algiers', offset: 1 },

    // -- East Africa --
    'NBO': { name: 'Nairobi', timezone: 'Africa/Nairobi', offset: 3 },
    'MBA': { name: 'Mombasa', timezone: 'Africa/Nairobi', offset: 3 },
    'DAR': { name: 'Dar es Salaam', timezone: 'Africa/Dar_es_Salaam', offset: 3 },
    'ZNZ': { name: 'Zanzibar', timezone: 'Africa/Dar_es_Salaam', offset: 3 },
    'JRO': { name: 'Kilimanjaro', timezone: 'Africa/Dar_es_Salaam', offset: 3 },
    'EBB': { name: 'Entebbe', timezone: 'Africa/Kampala', offset: 3 },
    'KGL': { name: 'Kigali', timezone: 'Africa/Kigali', offset: 2 },
    'ADD': { name: 'Addis Ababa', timezone: 'Africa/Addis_Ababa', offset: 3 },

    // -- West Africa --
    'LOS': { name: 'Lagos', timezone: 'Africa/Lagos', offset: 1 },
    'ABV': { name: 'Abuja', timezone: 'Africa/Lagos', offset: 1 },
    'ACC': { name: 'Accra', timezone: 'Africa/Accra', offset: 0 },
    'DSS': { name: 'Dakar', timezone: 'Africa/Dakar', offset: 0 },
    'ABJ': { name: 'Abidjan', timezone: 'Africa/Abidjan', offset: 0 },
    'BKO': { name: 'Bamako', timezone: 'Africa/Bamako', offset: 0 },
    'OUA': { name: 'Ouagadougou', timezone: 'Africa/Ouagadougou', offset: 0 },
    'DLA': { name: 'Douala', timezone: 'Africa/Douala', offset: 1 },
    'LBV': { name: 'Libreville', timezone: 'Africa/Libreville', offset: 1 },
    'LAD': { name: 'Luanda', timezone: 'Africa/Luanda', offset: 1 },

    // -- Southern Africa --
    'JNB': { name: 'Johannesburg', timezone: 'Africa/Johannesburg', offset: 2 },
    'CPT': { name: 'Cape Town', timezone: 'Africa/Johannesburg', offset: 2 },
    'DUR': { name: 'Durban', timezone: 'Africa/Johannesburg', offset: 2 },
    'WDH': { name: 'Windhoek', timezone: 'Africa/Windhoek', offset: 2 },
    'MPM': { name: 'Maputo', timezone: 'Africa/Maputo', offset: 2 },
    'HRE': { name: 'Harare', timezone: 'Africa/Harare', offset: 2 },
    'LUN': { name: 'Lusaka', timezone: 'Africa/Lusaka', offset: 2 },
    'LLW': { name: 'Lilongwe', timezone: 'Africa/Blantyre', offset: 2 },

    // -- Indian Ocean --
    'MRU': { name: 'Mauritius', timezone: 'Indian/Mauritius', offset: 4 },
    'SEZ': { name: 'Mahe (Seychelles)', timezone: 'Indian/Mahe', offset: 4 },
    'TNR': { name: 'Antananarivo', timezone: 'Indian/Antananarivo', offset: 3 },
    'RUN': { name: 'Reunion', timezone: 'Indian/Reunion', offset: 4 },

    // ===== OCEANIA =====

    // -- Australia --
    'SYD': { name: 'Sydney', timezone: 'Australia/Sydney', offset: 10 },
    'MEL': { name: 'Melbourne', timezone: 'Australia/Melbourne', offset: 10 },
    'BNE': { name: 'Brisbane', timezone: 'Australia/Brisbane', offset: 10 },
    'PER': { name: 'Perth', timezone: 'Australia/Perth', offset: 8 },
    'ADL': { name: 'Adelaide', timezone: 'Australia/Adelaide', offset: 9.5 },
    'CBR': { name: 'Canberra', timezone: 'Australia/Sydney', offset: 10 },
    'OOL': { name: 'Gold Coast', timezone: 'Australia/Brisbane', offset: 10 },
    'CNS': { name: 'Cairns', timezone: 'Australia/Brisbane', offset: 10 },
    'DRW': { name: 'Darwin', timezone: 'Australia/Darwin', offset: 9.5 },
    'TSV': { name: 'Townsville', timezone: 'Australia/Brisbane', offset: 10 },
    'HBA': { name: 'Hobart', timezone: 'Australia/Hobart', offset: 10 },
    'ASP': { name: 'Alice Springs', timezone: 'Australia/Darwin', offset: 9.5 },
    'AYQ': { name: 'Ayers Rock (Uluru)', timezone: 'Australia/Darwin', offset: 9.5 },
    'NTL': { name: 'Newcastle (NSW)', timezone: 'Australia/Sydney', offset: 10 },

    // -- New Zealand --
    'AKL': { name: 'Auckland', timezone: 'Pacific/Auckland', offset: 12 },
    'WLG': { name: 'Wellington', timezone: 'Pacific/Auckland', offset: 12 },
    'CHC': { name: 'Christchurch', timezone: 'Pacific/Auckland', offset: 12 },
    'ZQN': { name: 'Queenstown', timezone: 'Pacific/Auckland', offset: 12 },
    'DUD': { name: 'Dunedin', timezone: 'Pacific/Auckland', offset: 12 },
    'ROT': { name: 'Rotorua', timezone: 'Pacific/Auckland', offset: 12 },

    // -- Pacific Islands --
    'NAN': { name: 'Nadi (Fiji)', timezone: 'Pacific/Fiji', offset: 12 },
    'SUV': { name: 'Suva (Fiji)', timezone: 'Pacific/Fiji', offset: 12 },
    'PPT': { name: 'Papeete (Tahiti)', timezone: 'Pacific/Tahiti', offset: -10 },
    'NOU': { name: 'Noumea', timezone: 'Pacific/Noumea', offset: 11 },
    'APW': { name: 'Apia (Samoa)', timezone: 'Pacific/Apia', offset: 13 },
    'RAR': { name: 'Rarotonga', timezone: 'Pacific/Rarotonga', offset: -10 },
    'TBU': { name: 'Tongatapu', timezone: 'Pacific/Tongatapu', offset: 13 },
    'VLI': { name: 'Port Vila (Vanuatu)', timezone: 'Pacific/Efate', offset: 11 },
    'HIR': { name: 'Honiara', timezone: 'Pacific/Guadalcanal', offset: 11 },
    'POM': { name: 'Port Moresby', timezone: 'Pacific/Port_Moresby', offset: 10 },
    'GUM': { name: 'Guam', timezone: 'Pacific/Guam', offset: 10 },
};

// Populate timezone select elements
function populateTimezoneSelects() {
    const selects = document.querySelectorAll('select[id$="-timezone"], select.departure-timezone, select.arrival-timezone');
    selects.forEach(select => {
        if (select.options.length > 1) return; // Already populated

        // Clear and rebuild options using safe DOM methods
        while (select.firstChild) select.removeChild(select.firstChild);
        const defaultOpt = document.createElement('option');
        defaultOpt.value = '';
        defaultOpt.textContent = 'Select timezone...';
        select.appendChild(defaultOpt);

        TIMEZONES.forEach(tz => {
            const option = document.createElement('option');
            option.value = tz.id;
            option.textContent = tz.name;
            option.dataset.offset = tz.offset;
            select.appendChild(option);
        });
    });
}

// Get timezone offset from timezone ID or airport code
// If a date is provided, computes the actual offset for that date (DST-aware)
function getTimezoneOffset(timezoneIdOrAirport, date) {
    // Resolve to IANA timezone ID
    const tzId = resolveTimezoneId(timezoneIdOrAirport);

    // Try dynamic offset if date is provided
    if (date && tzId) {
        const dynamic = getDynamicOffset(tzId, date);
        if (dynamic !== null) return dynamic;
    }

    // Fallback to static offset
    const airport = AIRPORTS[timezoneIdOrAirport.toUpperCase?.() || ''];
    if (airport) return airport.offset;

    const tz = TIMEZONES.find(t => t.id === timezoneIdOrAirport);
    return tz ? tz.offset : null;
}

// Resolve an airport code or timezone ID to an IANA timezone ID
function resolveTimezoneId(timezoneIdOrAirport) {
    if (!timezoneIdOrAirport) return null;
    const airport = AIRPORTS[timezoneIdOrAirport.toUpperCase?.() || ''];
    if (airport) return airport.timezone;
    const tz = TIMEZONES.find(t => t.id === timezoneIdOrAirport);
    return tz ? tz.id : timezoneIdOrAirport; // Assume it's already an IANA ID
}

// Compute the actual UTC offset for a timezone at a specific date (DST-aware)
function getDynamicOffset(timezoneId, date) {
    try {
        const fmt = new Intl.DateTimeFormat('en-US', {
            timeZone: timezoneId,
            timeZoneName: 'longOffset',
        });
        const parts = fmt.formatToParts(date instanceof Date ? date : new Date(date));
        const tzPart = parts.find(p => p.type === 'timeZoneName');
        if (!tzPart) return null;
        if (tzPart.value === 'GMT') return 0;
        const match = tzPart.value.match(/GMT([+-])(\d{1,2}):?(\d{2})?/);
        if (match) {
            const sign = match[1] === '+' ? 1 : -1;
            return sign * (parseInt(match[2]) + parseInt(match[3] || '0') / 60);
        }
        return null;
    } catch (e) {
        return null;
    }
}

// Get timezone from airport code
function getTimezoneFromAirport(code) {
    const airport = AIRPORTS[code.toUpperCase()];
    return airport ? airport.timezone : null;
}

// Auto-detect user's timezone
function detectUserTimezone() {
    try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        const match = TIMEZONES.find(tz => tz.id === userTz);
        return match ? match.id : 'America/New_York';
    } catch (e) {
        return 'America/New_York';
    }
}
