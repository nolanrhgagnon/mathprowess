from prometheus_client import Counter

endpoint_hits = Counter(
    'api_endpoint_hits_total',
    'Hits per endpoint',
    ['endpoint', 'method', 'status']
)
