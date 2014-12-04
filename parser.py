## script to scrape and analyze the logs of a bit torrent download
## by Ian Zapolsky, 2014


import json
import random
import sys

def get_peers(filename):

  peers = []
  f = open(filename, 'r')

  for line in f:
    if (line.find('PeerInitiateConnectionCommand') != -1):
      unique = True
      conn = {
        'time': line.strip().split(' ')[1],
        'ip'  : line.strip().split(' ')[8]
      }
      for peer in peers:
        if conn['ip'] == peer['ip']:
          unique = False
          break
      if unique:
        peers.append(conn)

  for peer in peers:
    peer['reciepts'] = get_peer_reciepts(filename, peer['ip'])

  return peers

def get_peer_reciepts(filename, ip):

  peer_reciepts = []
  f = open(filename, 'r')

  for line in f:
    if line.find(ip) != -1 and line.find('From') != -1:
      peer_reciepts.append(line.strip())

  return peer_reciepts

# generate random tones for each peer
def get_tones(peers):
  tones = {}
  for peer in peers:
    tones[peer['ip']] = random.randint(200, 1600)
  return tones

def create_music(peers):
  tones = get_tones(peers) 
  f = open(filename, 'r')
  mf = open('music.txt', 'w')
  music = ''
  
  for line in f:
    for peer in peers:
      if line.find(peer['ip']) and line.find('From') != 1:
        music += str(tones[peer['ip']]) + '\n'
 
  mf.write(music) 
        

if __name__ == '__main__':

  if len(sys.argv) != 2:
    print 'usage: python parser.py <filename>'
    sys.exit(1)
  
  filename = sys.argv[1];
  peers = get_peers(filename) 
  create_music(peers)
